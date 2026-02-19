import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { ViolationItem } from "../../services/api";
import { API_BASE, deleteViolationImage } from "../../services/api";

interface ViolationsProps {
  items: ViolationItem[];
  onDelete?: (violation: ViolationItem) => void;
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString("en-IN", { hour12: false });
}

function filenameFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] ?? "";
}

export default function Violations({ items, onDelete }: ViolationsProps) {
  const [selected, setSelected] = useState<ViolationItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, v: ViolationItem) => {
    e.stopPropagation();
    const name = filenameFromUrl(v.evidence_image_url);
    if (!name) return;
    setError(null);
    setDeleting(true);
    try {
      await deleteViolationImage(name);
      if (selected?.evidence_image_url === v.evidence_image_url) setSelected(null);
      onDelete?.(v);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

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
      {error && (
        <p className="wrongway-error mb-2">{error}</p>
      )}
      <div className="wrongway-cards">
        {items.map((v, i) => (
          <div
            key={`${v.track_id}-${v.timestamp_ms}-${i}`}
            className="wrongway-card wrongway-card-clickable"
          >
            <button
              type="button"
              onClick={() => setSelected(v)}
              className="wrongway-card-image-wrap"
            >
              <img
                src={`${API_BASE}${v.evidence_image_url}`}
                alt={`Violation track ${v.track_id}`}
                className="wrongway-card-image"
              />
              <span className="wrongway-card-view-hint">Click to enlarge</span>
            </button>
            <div className="wrongway-card-body">
              <p><strong>Track ID:</strong> {v.track_id}</p>
              <p><strong>Lane:</strong> {v.lane}</p>
              <p><strong>Direction:</strong> {v.direction_detected}</p>
              <p><strong>Time:</strong> {formatTime(v.timestamp_ms)}</p>
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, v)}
                  disabled={deleting}
                  className="wrongway-card-delete"
                  aria-label="Delete violation"
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="wrongway-modal-backdrop"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="wrongway-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="wrongway-modal-header">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="wrongway-modal-close"
                >
                  Close
                </button>
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, selected)}
                    disabled={deleting}
                    className="wrongway-modal-delete"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                )}
              </div>
              <img
                src={`${API_BASE}${selected.evidence_image_url}`}
                alt={`Violation track ${selected.track_id}`}
                className="wrongway-modal-img"
              />
              <div className="wrongway-modal-caption">
                Track {selected.track_id} · {selected.lane} · {selected.direction_detected} · {formatTime(selected.timestamp_ms)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
