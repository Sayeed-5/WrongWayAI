import React, { useState, useRef } from "react";
import "./WrongWayDetection.css";

function WrongWayDetection() {
  const [videoURL, setVideoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file || !file.type.startsWith("video/")) return;

    setLoading(true);
    setError(null);
    setSelectedFile(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Upload failed (${response.status})`);
      }

      const data = await response.json();
      if (!data.video_url) throw new Error("No video URL in response");
      setVideoURL(data.video_url);
    } catch (err) {
      setError(err.message || "Failed to process video");
      setVideoURL(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="wrong-way-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>AI Wrong Way Traffic Detection System</h1>
          <p>Upload CCTV footage to detect traffic violations automatically</p>
        </header>

        <section className="upload-section">
          <div
            className={`upload-zone ${isDragging ? "upload-zone--active" : ""}`}
            onClick={handleZoneClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              aria-label="Upload video"
            />
            <div className="upload-zone-icon">📹</div>
            <p className="upload-zone-text">
              <strong>Drop your video here</strong> or click to browse
            </p>
            {selectedFile && !loading && (
              <div className="upload-file-name">{selectedFile}</div>
            )}
          </div>
        </section>

        {loading && (
          <section className="loading-section">
            <div className="spinner" aria-hidden="true" />
            <p>Processing video... please wait</p>
          </section>
        )}

        {error && (
          <div className="alert alert--error" role="alert">
            <span className="alert-icon" aria-hidden="true">
              ⚠
            </span>
            <p className="alert-message">{error}</p>
          </div>
        )}

        {videoURL && (
          <section className="result-card">
            <div className="result-card-header">Detection Result</div>
            <div className="result-card-body">
              <video
                width="640"
                height="480"
                controls
                key={videoURL}
                crossOrigin="anonymous"
                playsInline
              >
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </section>
        )}

        <section className="explanation-section">
          <h3>System Explanation</h3>
          <ul>
            <li>
              <strong>YOLO vehicle detection</strong> — Vehicles are detected in
              each frame using a YOLO-based model for real-time object
              detection.
            </li>
            <li>
              <strong>Direction tracking logic</strong> — Movement vectors are
              computed over time to determine each vehicle’s travel direction
              relative to the lane.
            </li>
            <li>
              <strong>Wrong-way violation detection</strong> — When a vehicle’s
              direction contradicts the defined lane orientation, the system
              flags it as a wrong-way violation and annotates the output video.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default WrongWayDetection;
