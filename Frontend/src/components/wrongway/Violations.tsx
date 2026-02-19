import type { ViolationItem } from "../../services/api";
import { API_BASE } from "../../services/api";

interface ViolationsProps {
  items: ViolationItem[];
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString("en-IN", { hour12: false });
}

export default function Violations({ items }: ViolationsProps) {
  if (items.length === 0) {
    return (
      <section className="wrongway-section">
        <h2 className="wrongway-heading">Violations</h2>
        <p className="wrongway-muted">No wrong-way violations detected.</p>
      </section>
    );
  }

  return (
    <section className="wrongway-section">
      <h2 className="wrongway-heading">Violations</h2>
      <div className="wrongway-cards">
        {items.map((v, i) => (
          <div key={`${v.track_id}-${v.timestamp_ms}-${i}`} className="wrongway-card">
            <div className="wrongway-card-image-wrap">
              <img
                src={`${API_BASE}${v.evidence_image_url}`}
                alt={`Violation track ${v.track_id}`}
                className="wrongway-card-image"
              />
            </div>
            <div className="wrongway-card-body">
              <p><strong>Track ID:</strong> {v.track_id}</p>
              <p><strong>Lane:</strong> {v.lane}</p>
              <p><strong>Direction:</strong> {v.direction_detected}</p>
              <p><strong>Time:</strong> {formatTime(v.timestamp_ms)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
