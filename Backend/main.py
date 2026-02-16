from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
from ultralytics import YOLO
import os
import time
import subprocess
import shutil

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_VIDEO_PATH = os.path.join(BACKEND_DIR, "output.mp4")
OUTPUT_TEMP_PATH = os.path.join(BACKEND_DIR, "output_temp.mp4")

model = YOLO("yolov8n.pt")


def _reencode_for_browser(source: str, dest: str) -> bool:
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
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


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


@app.post("/upload/")
async def upload_video(file: UploadFile = File(...)):

    input_path = os.path.join(BACKEND_DIR, "input.mp4")
    output_path = OUTPUT_TEMP_PATH

    with open(input_path, "wb") as f:
        f.write(await file.read())

    cap = cv2.VideoCapture(input_path)

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0 or fps is None:
        fps = 20

    frame_width = 640
    frame_height = 480

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(
        output_path,
        fourcc,
        fps,
        (frame_width, frame_height)
    )

    prev_centers = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (frame_width, frame_height))
        results = model(frame)

        current_centers = []

        for r in results:
            boxes = r.boxes.xyxy.cpu().numpy()
            classes = r.boxes.cls.cpu().numpy()

            for box, cls in zip(boxes, classes):
                if int(cls) == 2:  # car
                    x1, y1, x2, y2 = map(int, box)
                    center = ((x1 + x2) // 2, (y1 + y2) // 2)
                    current_centers.append((x1, y1, x2, y2, center))

        # Compare with previous frame
        if prev_centers:
            for (x1, y1, x2, y2, center), prev in zip(current_centers, prev_centers):
                movement = center[1] - prev[1]

                # UPWARD movement → WRONG
                if movement < -5:
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                    cv2.putText(
                        frame,
                        "WRONG WAY",
                        (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.6,
                        (0, 0, 255),
                        2
                    )

        # Store current centers for next frame
        prev_centers = [c[4] for c in current_centers]

        out.write(frame)

    cap.release()
    out.release()
    cv2.destroyAllWindows()

    # Re-encode to browser-friendly H264
    if _reencode_for_browser(OUTPUT_TEMP_PATH, OUTPUT_VIDEO_PATH):
        try:
            os.remove(OUTPUT_TEMP_PATH)
        except OSError:
            pass
    else:
        shutil.copy(OUTPUT_TEMP_PATH, OUTPUT_VIDEO_PATH)
        try:
            os.remove(OUTPUT_TEMP_PATH)
        except OSError:
            pass

    timestamp = int(time.time() * 1000)
    video_url = f"http://localhost:8000/video?t={timestamp}"
    return {"video_url": video_url}
