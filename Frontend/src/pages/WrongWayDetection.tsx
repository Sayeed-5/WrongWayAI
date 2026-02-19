import { useState } from "react";
import { uploadVideo, type UploadResponse } from "../services/api";
import Upload from "../components/wrongway/Upload";
import Dashboard from "../components/wrongway/Dashboard";
import Violations from "../components/wrongway/Violations";
import LaneChanges from "../components/wrongway/LaneChanges";

export default function WrongWayDetection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await uploadVideo(file);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrongway-page">
      <h1 className="wrongway-heading" style={{ marginBottom: "1.5rem" }}>
        Wrong-Way Vehicle Detection
      </h1>

      <Upload onFileSelect={handleUpload} loading={loading} error={error} />

      {result && (
        <>
          <section className="wrongway-section">
            <h2 className="wrongway-heading">Processed video</h2>
            <div className="wrongway-video-wrap">
              <video
                src={`${result.video_url}`}
                controls
                playsInline
                className="w-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </section>

          <Dashboard data={result} />
          <Violations
            items={result.violations}
            onDelete={(violation) => {
              setResult((prev) =>
                prev
                  ? {
                      ...prev,
                      violations: prev.violations.filter(
                        (v) =>
                          v.evidence_image_url !== violation.evidence_image_url ||
                          v.timestamp_ms !== violation.timestamp_ms
                      ),
                    }
                  : null
              );
            }}
          />
          <LaneChanges items={result.lane_changes} />
        </>
      )}
    </div>
  );
}
