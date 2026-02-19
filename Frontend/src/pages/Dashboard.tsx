import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 text-white">
        AI Traffic Monitoring Dashboard
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white/5 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-cyan-500/10">
          <h2 className="mb-3 sm:mb-4 font-semibold text-white text-sm sm:text-base">
            Analytics
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Upload a video in <strong className="text-cyan-400">Wrong-Way Detection</strong> to see real-time stats, heatmap, and violation analytics.
          </p>
          <Link
            to="/dashboard/wrong-way"
            className="mt-4 inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition"
          >
            Open Wrong-Way Detection
          </Link>
        </div>

        <div className="bg-white/5 border border-green-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-green-500/10 xl:col-span-2">
          <h2 className="mb-3 sm:mb-4 font-semibold text-white text-sm sm:text-base">
            AI System Status
          </h2>
          <p className="text-green-400 font-semibold text-sm sm:text-base">
            All monitoring modules active
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Use Wrong-Way Detection to process a video and view total tracked vehicles, wrong-way count, lane changes, violations, and heatmap.
          </p>
        </div>
      </div>
    </>
  );
}
