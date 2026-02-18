from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import cv2
import os
import time
import subprocess
import shutil

from ultralytics import YOLO
from deep_sort_realtime.deepsort_tracker import DeepSort

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_PATH = os.path.join(BASE_DIR, "input.mp4")
TEMP_OUTPUT_PATH = os.path.join(BASE_DIR, "temp_output.mp4")
FINAL_OUTPUT_PATH = os.path.join(BASE_DIR, "output.mp4")

# Load model
model = YOLO("yolov8n.pt")

# Deep SORT tracker
tracker = DeepSort(max_age=30)

LEGAL_DIRECTION = "UP"  # bottom -> top is legal
DIRECTION_THRESHOLD = 30  # pixels

def reencode_video(source, dest):
    try:
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", source,
                "-c:v", "libx264",
                "-pix_fmt", "yuv420p",
                "-movflags", "+faststart",
                dest,
            ],
            check=True,
            capture_output=True,
        )
        return True
    except Exception:
        return False


@app.get("/video")
def get_video():
    if not os.path.exists(FINAL_OUTPUT_PATH):
        raise HTTPException(status_code=404, detail="No processed video.")
    return FileResponse(FINAL_OUTPUT_PATH, media_type="video/mp4")


@app.post("/upload/")
async def upload_video(file: UploadFile = File(...)):

    with open(INPUT_PATH, "wb") as f:
        f.write(await file.read())

    cap = cv2.VideoCapture(INPUT_PATH)

    fps = cap.get(cv2.CAP_PROP_FPS)
    if not fps or fps == 0:
        fps = 20

    frame_width = 640
    frame_height = 480

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(TEMP_OUTPUT_PATH, fourcc, fps, (frame_width, frame_height))

    object_positions = {}
    wrong_ids = set()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (frame_width, frame_height))

        results = model(frame, conf=0.25)

        detections = []

        for r in results:
            boxes = r.boxes.xyxy.cpu().numpy()
            classes = r.boxes.cls.cpu().numpy()

            for box, cls in zip(boxes, classes):
                if int(cls) in [2, 3, 5, 7]:  # car, motorcycle, bus, truck
                    x1, y1, x2, y2 = map(int, box)
                    w = x2 - x1
                    h = y2 - y1
                    detections.append(([x1, y1, w, h], 1.0, "vehicle"))

        tracks = tracker.update_tracks(detections, frame=frame)

        for track in tracks:
            if not track.is_confirmed():
                continue

            track_id = track.track_id
            l, t, r, b = track.to_ltrb()
            l, t, r, b = int(l), int(t), int(r), int(b)

            center_y = (t + b) // 2

            # First appearance
            if track_id not in object_positions:
                object_positions[track_id] = {
                    "initial_y": center_y
                }
                continue

            initial_y = object_positions[track_id]["initial_y"]
            total_movement = center_y - initial_y

            is_wrong = False

            if LEGAL_DIRECTION == "UP":
                if total_movement > DIRECTION_THRESHOLD:
                    is_wrong = True
            else:
                if total_movement < -DIRECTION_THRESHOLD:
                    is_wrong = True

            if is_wrong:
                wrong_ids.add(track_id)
                color = (0, 0, 255)
                label = "WRONG WAY"
            else:
                color = (0, 255, 0)
                label = "OK"

            cv2.rectangle(frame, (l, t), (r, b), color, 2)
            cv2.putText(
                frame,
                f"ID {track_id} - {label}",
                (l, t - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                color,
                2,
            )

        out.write(frame)

    cap.release()
    out.release()
    cv2.destroyAllWindows()

    if reencode_video(TEMP_OUTPUT_PATH, FINAL_OUTPUT_PATH):
        os.remove(TEMP_OUTPUT_PATH)
    else:
        shutil.copy(TEMP_OUTPUT_PATH, FINAL_OUTPUT_PATH)
        os.remove(TEMP_OUTPUT_PATH)

    timestamp = int(time.time() * 1000)
    video_url = f"http://localhost:8000/video?t={timestamp}"

    return {
        "video_url": video_url,
        "wrong_vehicle_count": len(wrong_ids)
    }
