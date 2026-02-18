import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, Activity, Upload, Trash2 } from "lucide-react";
import { uploadVideo, getViolations, deleteViolation, type Violation, API_BASE } from "../services/api";

interface LocationState {
  videoUrl?: string;
}

export default function WrongWayDetection() {
  const { state } = useLocation() as { state?: LocationState };
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoUrl = state?.videoUrl ?? localVideoUrl;

  const processFile = async (file: File) => {
    if (!file || !file.type.startsWith("video/")) return;

    try {
      setLoading(true);
      setError(null);
      setSelectedFileName(file.name);

      // Snapshot existing violations before processing this video
      const existing = await getViolations();
      const existingIds = existing.map((v) => v.id);
      const { video_url } = await uploadVideo(file);
      setLocalVideoUrl(video_url);

      // Fetch all violations again and keep only the new ones for this video
      const updated = await getViolations();
      const newViolations = updated.filter((v) => !existingIds.includes(v.id));
      setViolations(newViolations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process video");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
    e.target.value = "";
  };

  const handleZoneClick = () => fileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDelete = async (id: number) => {
    try {
      await deleteViolation(id);
      setViolations((prev) => prev.filter((v) => v.id !== id));
      if (selectedViolation?.id === id) {
        setSelectedViolation(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete violation");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2">
          🚦 Wrong-Way Detection System
        </h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-green-400">
          <ShieldCheck size={16} className="sm:size-[18px]" />
          AI Monitoring Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-8 bg-white/5 border border-cyan-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 relative">
          {videoUrl ? (
            <>
              <video
                key={videoUrl}
                src={videoUrl}
                controls
                autoPlay
                muted
                playsInline
                className="w-full h-[220px] sm:h-[300px] lg:h-[400px] object-cover rounded-lg sm:rounded-xl"
              />
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-300">
                <span>Processed video ready</span>
                <span className="text-green-400">Detection complete</span>
              </div>
            </>
          ) : (
            <div
              onClick={handleZoneClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full h-[220px] sm:h-[300px] lg:h-[400px] border-2 border-dashed border-cyan-500/40 rounded-lg sm:rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-cyan-500/60 hover:bg-white/5 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload video"
              />
              {loading ? (
                <>
                  <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                  <p className="text-gray-300 text-sm sm:text-base">
                    Processing video... please wait
                  </p>
                </>
              ) : (
                <>
                  <Upload size={40} className="text-cyan-400/80" />
                  <p className="text-gray-300 text-sm sm:text-base">
                    <span className="text-cyan-400 font-medium">
                      Drop your video here
                    </span>{" "}
                    or click to browse
                  </p>
                  {selectedFileName && (
                    <p className="text-gray-500 text-xs truncate max-w-[90%]">
                      {selectedFileName}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          {error && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm"
              >
                <AlertTriangle size={18} />
                {error}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="bg-white/5 border border-blue-500/20 rounded-xl p-3 sm:p-4">
            <h3 className="text-blue-400 font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Activity size={16} className="sm:size-[18px]" /> Lane Direction Monitor
            </h3>
            <div className="flex justify-between text-xs sm:text-sm text-gray-300">
              <span>Expected Direction</span>
              <span className="text-green-400">→ Forward</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-300 mt-2">
              <span>Status</span>
              <span className={videoUrl ? "text-green-400" : "text-gray-500"}>
                {videoUrl ? "Analysis complete" : "Upload to analyze"}
              </span>
            </div>
          </div>
          <div className="bg-white/5 border border-red-500/20 rounded-xl p-3 sm:p-4">
            <h3 className="text-red-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Instructions</h3>
            <ul className="text-xs sm:text-sm space-y-1.5 sm:space-y-2 text-gray-300">
              <li>1. Upload here or go to Home to upload</li>
              <li>2. Wait for AI processing</li>
              <li>3. View annotated result</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-3 sm:p-4">
            <h3 className="text-yellow-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
              Violation Reports
            </h3>
            {violations.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-400">
                No wrong-way violations detected yet.
              </p>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-gray-300 mb-2">
                  Total violations: <span className="text-red-400 font-semibold">{violations.length}</span>
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 max-h-48 sm:max-h-52 overflow-y-auto pr-1">
                  {violations.map((violation) => (
                    <div
                      key={violation.id}
                      className="relative group rounded-md overflow-hidden border border-white/10 hover:border-yellow-400/60"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedViolation(violation)}
                        className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-yellow-400/70"
                      >
                        <img
                          src={`${API_BASE}${violation.image_path}`}
                          alt={`Violation ${violation.id}`}
                          className="w-full h-16 sm:h-20 object-cover transition-transform group-hover:scale-105"
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
                          handleDelete(violation.id);
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white shadow-md"
                        aria-label="Delete violation"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
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
              className="relative max-w-3xl w-full max-h-[90vh] bg-[#020617] border border-yellow-400/40 rounded-xl overflow-hidden"
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
                alt={`Violation ${selectedViolation.id}`}
                className="w-full max-h-[90vh] object-contain bg-black"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
