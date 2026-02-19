# AI-Based Wrong-Way Vehicle Detection System

Backend: FastAPI + OpenCV + Ultralytics YOLOv8 (ByteTrack).  
Frontend: React (Vite), dark UI, upload → processed video + dashboard + violations + lane changes.

No database; violation images are saved under `backend/violators/`. Upload returns JSON with `video_url`, `total_tracked_vehicles`, `wrong_way_count`, `violations`, and `lane_changes`.

---

## Run backend

```bash
cd Backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate   # macOS/Linux
pip install fastapi uvicorn opencv-python ultralytics imageio python-multipart
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API: `http://localhost:8000`
- Processed video: `GET /video`
- Violation images: `GET /violators/<filename>`
- Upload: `POST /upload/` (body: multipart file)

---

## Run frontend

```bash
cd Frontend
npm install
npm run dev
```

- App: `http://localhost:5173` (or the port Vite prints)
- Open **Dashboard → Wrong-Way Detection**, upload a video, then view processed video, stats, violation cards, and lane-change list.

---

## Project layout

```
WrongWayAI/
  Backend/
    main.py          # Single FastAPI app, no DB
    violators/       # Violation images (created automatically)
  Frontend/
    src/
      App.tsx
      pages/WrongWayDetection.tsx
      components/wrongway/Upload.tsx, Dashboard.tsx, Violations.tsx, LaneChanges.tsx
      services/api.ts
```
