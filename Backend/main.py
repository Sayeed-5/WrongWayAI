from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import cv2
from ultralytics import YOLO
import os
import time
import imageio
import shutil
import sqlite3
from pydantic import BaseModel
from typing import List

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_VIDEO_PATH = os.path.join(BACKEND_DIR, "output.mp4")
OUTPUT_TEMP_PATH = os.path.join(BACKEND_DIR, "output_temp.mp4")
VIOLATORS_DIR = os.path.join(BACKEND_DIR, "violators")
DB_PATH = os.path.join(BACKEND_DIR, "violations.db")

# Ensure directory exists
if not os.path.exists(VIOLATORS_DIR):
    os.makedirs(VIOLATORS_DIR)

# Mount static files for accessing images
app.mount("/violators", StaticFiles(directory=VIOLATORS_DIR), name="violators")

# Database Setup
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS violations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            track_id INTEGER,
            timestamp INTEGER,
            image_path TEXT,
            video_timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def log_violation(track_id, image_filename):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO violations (track_id, timestamp, image_path, video_timestamp) VALUES (?, ?, ?, ?)",
        (track_id, int(time.time()), f"/violators/{image_filename}", "00:00")
    )
    conn.commit()
    conn.close()

def load_model():
    # Priority list for model files
    model_files = ["indian_model.pt", "best.pt", "custom_yolov8.pt", "yolov8n.pt"]
    
    for model_file in model_files:
        model_path = os.path.join(BACKEND_DIR, model_file)
        if os.path.exists(model_path):
            print(f"Loading model: {model_file}")
            try:
                return YOLO(model_path)
            except Exception as e:
                print(f"Failed to load {model_file}: {e}")
    
    # Fallback if nothing found (shouldn't happen if yolov8n.pt is tracked)
    print("Warning: No model found! Attempting download of yolov8n.pt...")
    return YOLO("yolov8n.pt")

model = load_model()


@app.get("/video")
def get_video():
    if not os.path.exists(OUTPUT_VIDEO_PATH):
        raise HTTPException(status_code=404, detail="No processed video yet.")
    return FileResponse(
        OUTPUT_VIDEO_PATH,
        media_type="video/mp4",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    )

@app.get("/violations")
def get_violations():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM violations ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.delete("/violations/{violation_id}")
def delete_violation(violation_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT image_path FROM violations WHERE id = ?", (violation_id,))
    row = cursor.fetchone()

    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Violation not found")

    image_path = row[0] or ""

    cursor.execute("DELETE FROM violations WHERE id = ?", (violation_id,))
    conn.commit()
    conn.close()

    # Remove the corresponding image file if it exists
    if image_path:
        filename = os.path.basename(image_path)
        file_path = os.path.join(VIOLATORS_DIR, filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError:
                # If deletion fails, we still consider the violation removed from DB
                pass

    return {"message": "Violation deleted"}

@app.delete("/violations")
def clear_violations():
    # Clear DB
    conn = sqlite3.connect(DB_PATH)
    conn.execute("DELETE FROM violations")
    conn.commit()
    conn.close()
    
    # Clear Images
    if os.path.exists(VIOLATORS_DIR):
        shutil.rmtree(VIOLATORS_DIR)
    os.makedirs(VIOLATORS_DIR, exist_ok=True)
    
    return {"message": "All violations cleared"}


@app.post("/upload/")
async def upload_video(file: UploadFile = File(...)):

    input_path = os.path.join(BACKEND_DIR, "input.mp4")
    
    # Clean up previous output and violations (optional, keeping DB persistent for now)
    # If you want to clear DB per run, uncomment:
    # conn = sqlite3.connect(DB_PATH)
    # conn.execute("DELETE FROM violations")
    # conn.commit()
    # conn.close()
    
    if os.path.exists(OUTPUT_VIDEO_PATH):
        try:
            os.remove(OUTPUT_VIDEO_PATH)
        except OSError:
            pass
            
    # if os.path.exists(VIOLATORS_DIR):
    #     shutil.rmtree(VIOLATORS_DIR)
    # os.makedirs(VIOLATORS_DIR, exist_ok=True)

    with open(input_path, "wb") as f:
        f.write(await file.read())

    cap = cv2.VideoCapture(input_path)

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0 or fps is None:
        fps = 20

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    if frame_width == 0: frame_width = 640
    if frame_height == 0: frame_height = 480

    # improved video writing using imageio with explicit h264 codec
    writer = imageio.get_writer(
        OUTPUT_VIDEO_PATH, 
        fps=fps, 
        codec='libx264', 
        quality=8, 
        pixelformat='yuv420p',
        macro_block_size=None 
    )

    # Dictionary to store tracking history: {track_id: [(x, y), ...]}
    track_history = {}
    # Set to keep track of vehicles already flagged as wrong way to avoid duplicate saves
    flagged_ids = set()
    
    # Logic for Wrong Way
    MOVEMENT_THRESHOLD = 8
    LANE_SPLIT_X = frame_width // 2 # Assume road is split in middle
    
    # LHT (Left Hand Traffic) Rules:
    # Left Lane (x < SPLIT): Vehicles should come DOWN (y increases). WRONG if y decreases (UP).
    # Right Lane (x >= SPLIT): Vehicles should go UP (y decreases). WRONG if y increases (DOWN).

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # frame = cv2.resize(frame, (frame_width, frame_height))
            
            # Draw Lane Divider
            cv2.line(frame, (LANE_SPLIT_X, 0), (LANE_SPLIT_X, frame_height), (255, 255, 0), 2)
            cv2.putText(frame, "DOWN (Allowed)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(frame, "UP (Allowed)", (frame_width - 200, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            # Use YOLO tracking; persist=True is crucial for video
            results = model.track(frame, persist=True, tracker="bytetrack.yaml", verbose=False)

            if results and results[0].boxes and results[0].boxes.id is not None:
                boxes = results[0].boxes.xyxy.cpu().numpy()
                track_ids = results[0].boxes.id.int().cpu().tolist()
                classes = results[0].boxes.cls.int().cpu().tolist()

                for box, track_id, cls in zip(boxes, track_ids, classes):
                    # Filter for vehicles
                    if cls not in [2, 3, 5, 7]:
                         continue

                    x1, y1, x2, y2 = map(int, box)
                    center_x = (x1 + x2) // 2
                    center_y = (y1 + y2) // 2
                    current_center = (center_x, center_y)
                    
                    # Class label (works for COCO + custom models)
                    try:
                        cls_name = model.names.get(cls, str(cls)) if isinstance(model.names, dict) else model.names[cls]
                    except Exception:
                        cls_name = str(cls)

                    # Update history
                    if track_id not in track_history:
                        track_history[track_id] = []
                    
                    track_history[track_id].append(current_center)
                    
                    if len(track_history[track_id]) > 30:
                        track_history[track_id].pop(0)

                    # Check movement
                    history = track_history[track_id]
                    if len(history) > 5:
                        prev_x, prev_y = history[0]
                        dy = center_y - prev_y
                        
                        is_wrong_way = False
                        
                        # Determine Lane
                        if center_x < LANE_SPLIT_X:
                            # LEFT LANE: Should move DOWN (dy > 0). 
                            # Wrong if Moving UP significantly (dy < -threshold)
                            if dy < -MOVEMENT_THRESHOLD:
                                is_wrong_way = True
                        else:
                            # RIGHT LANE: Should move UP (dy < 0).
                            # Wrong if Moving DOWN significantly (dy > threshold)
                            if dy > MOVEMENT_THRESHOLD:
                                is_wrong_way = True
                        
                        if is_wrong_way:
                            # Draw Warning
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                            cv2.putText(frame, f"WRONG WAY {cls_name} {track_id}", (x1, y1 - 10), 
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                            
                            if track_id not in flagged_ids:
                                flagged_ids.add(track_id)
                                timestamp = int(time.time())
                                violation_filename = f"violation_{timestamp}_{track_id}.jpg"
                                violation_path = os.path.join(VIOLATORS_DIR, violation_filename)
                                cv2.imwrite(violation_path, frame)
                                
                                # Log to DB
                                log_violation(track_id, violation_filename)
                        else:
                            # Correct Way - Green Box
                             cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                             cv2.putText(frame, f"{cls_name} {track_id}", (x1, y1 - 10),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                             # Debug Text
                             # cv2.putText(frame, f"{dy}", (x1, y1-30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1)

            # Convert BGR (OpenCV) to RGB (imageio)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            writer.append_data(frame_rgb)
            
    finally:
        cap.release()
        writer.close()
        cv2.destroyAllWindows()


    timestamp = int(time.time() * 1000)
    video_url = f"http://localhost:8000/video?t={timestamp}"
    return {"video_url": video_url, "violation_count": len(flagged_ids)}