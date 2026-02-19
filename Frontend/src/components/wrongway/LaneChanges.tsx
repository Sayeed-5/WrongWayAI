import type { LaneChangeItem } from "../../services/api";

interface LaneChangesProps {
  items: LaneChangeItem[];
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString("en-IN", { hour12: false });
}

export default function LaneChanges({ items }: LaneChangesProps) {
  if (items.length === 0) {
    return (
      <section className="wrongway-section">
        <h2 className="wrongway-heading">Lane change events</h2>
        <p className="wrongway-muted">No lane changes detected.</p>
      </section>
    );
  }

  return (
    <section className="wrongway-section">
      <h2 className="wrongway-heading">Lane change events</h2>
      <ul className="wrongway-lane-list">
        {items.map((e, i) => (
          <li key={`${e.track_id}-${e.timestamp_ms}-${i}`} className="wrongway-lane-item">
            <span className="wrongway-lane-track">Track {e.track_id}</span>
            <span className="wrongway-lane-arrow">{e.from_lane} → {e.to_lane}</span>
            <span className="wrongway-lane-time">{formatTime(e.timestamp_ms)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
