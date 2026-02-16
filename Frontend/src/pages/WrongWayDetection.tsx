import { useLocation, Link } from "react-router-dom";
import { ShieldCheck, Activity } from "lucide-react";

interface LocationState {
  videoUrl?: string;
}

export default function WrongWayDetection() {
  const { state } = useLocation() as { state?: LocationState };
  const videoUrl = state?.videoUrl ?? null;

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
            <div className="w-full h-[220px] sm:h-[300px] lg:h-[400px] rounded-lg sm:rounded-xl flex flex-col items-center justify-center gap-2 text-center px-4 bg-white/5 border border-cyan-500/20">
              <p className="text-gray-300 text-sm sm:text-base">
                No processed video found. Please upload a video first.
              </p>
              <Link
                to="/"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                Go to Home to upload
              </Link>
            </div>
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
              <li>1. Go to Home and upload a video</li>
              <li>2. Wait for AI processing</li>
              <li>3. View annotated result here</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
