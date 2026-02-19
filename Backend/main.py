"""
AI-Based Wrong-Way Vehicle Detection - Backend
FastAPI + OpenCV + Ultralytics YOLOv8 + ByteTrack. No database.
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from ultralytics import YOLO
import os
import time
import imageio

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": str(exc)})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_VIDEO_PATH = os.path.join(BACKEND_DIR, "output.mp4")
HEATMAP_PATH = os.path.join(BACKEND_DIR, "heatmap.jpg")
VIOLATORS_DIR = os.path.join(BACKEND_DIR, "violators")

os.makedirs(VIOLATORS_DIR, exist_ok=True)
app.mount("/violators", StaticFiles(directory=VIOLATORS_DIR), name="violators")

# Model
MODEL_FILES = ["indian_model.pt", "best.pt", "custom_yolov8.pt", "yolov8n.pt"]

def load_model():
    for name in MODEL_FILES:
        path = os.path.join(BACKEND_DIR, name)
        if os.path.exists(path):
            print(f"Loading model: {name}")
            return YOLO(path)
    print("Using yolov8n.pt")
    return YOLO("yolov8n.pt")

model = load_model()

MOVEMENT_THRESHOLD = 8
MAX_HISTORY = 20
VEHICLE_CLASSES = [2, 3, 5, 7]  # COCO: car, motorcycle, bus, truck


@app.get("/heatmap")
def get_heatmap():
    if not os.path.exists(HEATMAP_PATH):
        raise HTTPException(status_code=404, detail="No heatmap yet.")
    return FileResponse(
        HEATMAP_PATH,
        media_type="image/jpeg",
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"},
    )


@app.get("/video")
def get_video():
    if not os.path.exists(OUTPUT_VIDEO_PATH):
        raise HTTPException(status_code=404, detail="No processed video yet.")
    return FileResponse(
        OUTPUT_VIDEO_PATH,
        media_type="video/mp4",
        headers={"Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache", "Expires": "0"},
    )


@app.post("/upload/")
async def upload_video(file: UploadFile = File(...)):
    input_path = os.path.join(BACKEND_DIR, "input.mp4")

    # Clear previous run: remove output and violators
    if os.path.exists(OUTPUT_VIDEO_PATH):
        try:
            os.remove(OUTPUT_VIDEO_PATH)
        except OSError:
            pass
    for f in os.listdir(VIOLATORS_DIR):
        try:
            os.remove(os.path.join(VIOLATORS_DIR, f))
        except OSError:
            pass
    if os.path.exists(HEATMAP_PATH):
        try:
            os.remove(HEATMAP_PATH)
        except OSError:
            pass

    with open(input_path, "wb") as f:
        f.write(await file.read())

    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 20
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 640
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 480

    writer = imageio.get_writer(
        OUTPUT_VIDEO_PATH,
        fps=fps,
        codec="libx264",
        quality=8,
        pixelformat="yuv420p",
        macro_block_size=None,
    )

    track_history = {}
    flagged_ids = set()
    lane_memory = {}
    violations = []
    lane_changes = []
    all_track_ids = set()
    heatmap = np.zeros((frame_height, frame_width), dtype=np.float32)

    LANE_SPLIT_X = frame_width // 2
    frame_index = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            cv2.line(frame, (LANE_SPLIT_X, 0), (LANE_SPLIT_X, frame_height), (255, 255, 0), 2)
            cv2.putText(frame, "DOWN (Allowed)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(frame, "UP (Allowed)", (frame_width - 200, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            results = model.track(frame, persist=True, tracker="bytetrack.yaml", verbose=False, conf=0.6)

            if results and results[0].boxes is not None and results[0].boxes.id is not None:
                boxes = results[0].boxes.xyxy.cpu().numpy()
                track_ids = results[0].boxes.id.int().cpu().tolist()
                classes = results[0].boxes.cls.int().cpu().tolist()

                for box, track_id, cls in zip(boxes, track_ids, classes):
                    if cls not in VEHICLE_CLASSES:
                        continue

                    x1, y1, x2, y2 = map(int, box)
                    center_x = (x1 + x2) // 2
                    center_y = (y1 + y2) // 2
                    current_center = (center_x, center_y)
                    all_track_ids.add(track_id)

                    if track_id not in track_history:
                        track_history[track_id] = []
                    track_history[track_id].append(current_center)
                    if len(track_history[track_id]) > MAX_HISTORY:
                        track_history[track_id].pop(0)

                    current_lane = "LEFT" if center_x < LANE_SPLIT_X else "RIGHT"
                    if track_id in lane_memory and lane_memory[track_id] != current_lane:
                        lane_changes.append({
                            "track_id": int(track_id),
                            "from_lane": lane_memory[track_id],
                            "to_lane": current_lane,
                            "timestamp_ms": int(time.time() * 1000),
                        })
                    lane_memory[track_id] = current_lane

                    history = track_history[track_id]
                    if len(history) < 5:
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        continue

                    prev_x, prev_y = history[0]
                    dy = center_y - prev_y
                    is_wrong = False
                    if center_x < LANE_SPLIT_X:
                        if dy < -MOVEMENT_THRESHOLD:
                            is_wrong = True
                    else:
                        if dy > MOVEMENT_THRESHOLD:
                            is_wrong = True

                    direction_detected = "UP" if dy < 0 else "DOWN"

                    if is_wrong:
                        # Heatmap: add around vehicle center (15px radius, clamped)
                        y_lo = max(0, center_y - 15)
                        y_hi = min(frame_height, center_y + 16)
                        x_lo = max(0, center_x - 15)
                        x_hi = min(frame_width, center_x + 16)
                        heatmap[y_lo:y_hi, x_lo:x_hi] += 1
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                        cv2.putText(frame, f"WRONG WAY {track_id}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                        if track_id not in flagged_ids:
                            flagged_ids.add(track_id)
                            ts = int(time.time())
                            filename = f"violation_{ts}_{track_id}.jpg"
                            filepath = os.path.join(VIOLATORS_DIR, filename)
                            cv2.imwrite(filepath, frame)
                            violations.append({
                                "track_id": int(track_id),
                                "lane": current_lane,
                                "direction_detected": direction_detected,
                                "timestamp_ms": int(time.time() * 1000),
                                "evidence_image_url": f"/violators/{filename}",
                            })
                    else:
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            writer.append_data(frame_rgb)
            frame_index += 1

    finally:
        cap.release()
        writer.close()
        cv2.destroyAllWindows()

    # Normalize and save heatmap
    if heatmap.max() > 0:
        heatmap_norm = cv2.normalize(heatmap, None, 0, 255, cv2.NORM_MINMAX)
        heatmap_norm = heatmap_norm.astype(np.uint8)
        heatmap_color = cv2.applyColorMap(heatmap_norm, cv2.COLORMAP_JET)
        cv2.imwrite(HEATMAP_PATH, heatmap_color)
    else:
        # Empty heatmap: save a blank JET image so endpoint always returns something
        blank = np.zeros((frame_height, frame_width), dtype=np.uint8)
        cv2.imwrite(HEATMAP_PATH, cv2.applyColorMap(blank, cv2.COLORMAP_JET))

    t = int(time.time() * 1000)
    video_url = f"http://localhost:8000/video?t={t}"
    return {
        "video_url": video_url,
        "heatmap_url": "/heatmap",
        "total_tracked_vehicles": len(all_track_ids),
        "wrong_way_count": len(flagged_ids),
        "violations": violations,
        "lane_changes": lane_changes,
    }
