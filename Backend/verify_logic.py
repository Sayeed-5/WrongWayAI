import cv2
from ultralytics import YOLO
import os
import time
import imageio
import shutil

# Setup Paths
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_VIDEO_PATH = os.path.join(BACKEND_DIR, "input.mp4")
OUTPUT_VIDEO_PATH = os.path.join(BACKEND_DIR, "output_verify.mp4")
VIOLATORS_DIR = os.path.join(BACKEND_DIR, "violators_verify")

# Ensure directories
if os.path.exists(VIOLATORS_DIR):
    shutil.rmtree(VIOLATORS_DIR)
os.makedirs(VIOLATORS_DIR, exist_ok=True)

def load_model():
    model_files = ["indian_model.pt", "best.pt", "custom_yolov8.pt", "yolov8n.pt"]
    for model_file in model_files:
        model_path = os.path.join(BACKEND_DIR, model_file)
        if os.path.exists(model_path):
            print(f"Loading model: {model_file}")
            return YOLO(model_path)
    print("Warning: No model found! Attempting download of yolov8n.pt...")
    return YOLO("yolov8n.pt")

def main():
    if not os.path.exists(INPUT_VIDEO_PATH):
        print(f"Error: {INPUT_VIDEO_PATH} not found.")
        return

    model = load_model()
    cap = cv2.VideoCapture(INPUT_VIDEO_PATH)

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0 or fps is None: fps = 20
    
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    print(f"Video Info: {frame_width}x{frame_height} @ {fps}fps")

    writer = imageio.get_writer(
        OUTPUT_VIDEO_PATH, 
        fps=fps, 
        codec='libx264', 
        quality=8, 
        pixelformat='yuv420p',
        macro_block_size=None 
    )

    track_history = {}
    flagged_ids = set()
    
    MOVEMENT_THRESHOLD = 8
    LANE_SPLIT_X = frame_width // 2 
    
    print(f"Lane Split X: {LANE_SPLIT_X}")

    frame_count = 0
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            if frame_count % 30 == 0:
                print(f"Processing frame {frame_count}...")

            # Draw Lane Divider
            cv2.line(frame, (LANE_SPLIT_X, 0), (LANE_SPLIT_X, frame_height), (255, 255, 0), 2)
            cv2.putText(frame, "DOWN (Allowed)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(frame, "UP (Allowed)", (frame_width - 200, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            results = model.track(frame, persist=True, tracker="bytetrack.yaml", verbose=False)

            if results and results[0].boxes and results[0].boxes.id is not None:
                boxes = results[0].boxes.xyxy.cpu().numpy()
                track_ids = results[0].boxes.id.int().cpu().tolist()
                classes = results[0].boxes.cls.int().cpu().tolist()

                for box, track_id, cls in zip(boxes, track_ids, classes):
                    if cls not in [2, 3, 5, 7]: # vehicles
                         continue

                    x1, y1, x2, y2 = map(int, box)
                    center_x = (x1 + x2) // 2
                    center_y = (y1 + y2) // 2
                    
                    if track_id not in track_history:
                        track_history[track_id] = []
                    
                    track_history[track_id].append((center_x, center_y))
                    
                    if len(track_history[track_id]) > 30:
                        track_history[track_id].pop(0)

                    history = track_history[track_id]
                    if len(history) > 5:
                        prev_x, prev_y = history[0]
                        dy = center_y - prev_y
                        
                        is_wrong_way = False
                        
                        # Logic check
                        if center_x < LANE_SPLIT_X: # Left Lane
                            if dy < -MOVEMENT_THRESHOLD: # Moving UP
                                is_wrong_way = True
                        else: # Right Lane
                            if dy > MOVEMENT_THRESHOLD: # Moving DOWN
                                is_wrong_way = True
                        
                        if is_wrong_way:
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                            cv2.putText(frame, f"WRONG WAY {track_id}", (x1, y1 - 10), 
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                            
                            if track_id not in flagged_ids:
                                flagged_ids.add(track_id)
                                print(f"!!! VIOLATION DETECTED: ID {track_id} in {'LEFT' if center_x < LANE_SPLIT_X else 'RIGHT'} lane moving {'UP' if dy < 0 else 'DOWN'}")
                                cv2.imwrite(os.path.join(VIOLATORS_DIR, f"violation_{track_id}.jpg"), frame)
                        else:
                             cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            writer.append_data(frame_rgb)
            
    finally:
        cap.release()
        writer.close()
        cv2.destroyAllWindows()
        print(f"Finished. Output saved to {OUTPUT_VIDEO_PATH}")
        print(f"Total Violations Detected: {len(flagged_ids)}")

if __name__ == "__main__":
    main()
