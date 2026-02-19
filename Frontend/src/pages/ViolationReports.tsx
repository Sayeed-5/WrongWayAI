import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { getViolations, deleteViolationImage, type Violation, API_BASE } from "../services/api";

export default function ViolationReports() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getViolations();
        setViolations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load violations");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (filename: string) => {
    try {
      setError(null);
      await deleteViolationImage(filename);
      setViolations((prev) => prev.filter((v) => v.filename !== filename));
      if (selectedViolation?.filename === filename) {
        setSelectedViolation(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete violation");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="text-red-400" />
          Global Violation Reports
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Showing all stored wrong-way violation snapshots
        </p>
      </div>

      <div className="bg-white/5 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-5">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-300 text-sm sm:text-base">
            Loading violations...
          </div>
        ) : error ? (
          <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/40 rounded-lg text-sm sm:text-base text-red-300 flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
          </div>
        ) : violations.length === 0 ? (
          <p className="py-6 text-center text-xs sm:text-sm text-gray-400">
            No violations have been recorded yet.
          </p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-300">
                Total violations:{" "}
                <span className="text-red-400 font-semibold">{violations.length}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
              {violations.map((violation) => (
                <div
                  key={violation.filename}
                  className="relative group rounded-md overflow-hidden border border-white/10 hover:border-yellow-400/70"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedViolation(violation)}
                    className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-yellow-400/70"
                  >
                    <img
                      src={`${API_BASE}${violation.image_path}`}
                      alt={`Violation ${violation.filename}`}
                      className="w-full h-24 sm:h-28 md:h-32 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] sm:text-xs text-yellow-300 font-medium">
                        View
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(violation.filename);
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white shadow-md"
                    aria-label="Delete violation"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedViolation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedViolation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-[#020617] border border-yellow-400/40 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedViolation(null)}
                className="absolute top-2 right-2 z-10 px-2 py-1 text-xs sm:text-sm rounded-md bg-black/60 hover:bg-black/80 text-white"
              >
                Close
              </button>
              <img
                src={`${API_BASE}${selectedViolation.image_path}`}
                alt={`Violation ${selectedViolation.filename}`}
                className="w-full max-h-[90vh] object-contain bg-black"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

