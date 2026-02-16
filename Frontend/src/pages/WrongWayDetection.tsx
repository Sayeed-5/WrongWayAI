import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, Activity, Upload } from "lucide-react";
import { uploadVideo } from "../services/api";

interface LocationState {
  videoUrl?: string;
}

export default function WrongWayDetection() {
  const { state } = useLocation() as { state?: LocationState };
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoUrl = state?.videoUrl ?? localVideoUrl;

  const processFile = async (file: File) => {
    if (!file || !file.type.startsWith("video/")) return;

    setLoading(true);
    setError(null);
    setSelectedFileName(file.name);

    try {
      const { video_url } = await uploadVideo(file);
      setLocalVideoUrl(video_url);
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
        </div>
      </div>
    </div>
  );
}
