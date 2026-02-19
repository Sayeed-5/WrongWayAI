import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAnalytics, API_BASE, type Analytics } from "../services/api";

const defaultAnalytics: Analytics = {
  total_videos_processed: 0,
  total_tracked_vehicles: 0,
  total_wrong_way: 0,
  total_lane_changes: 0,
  violations_per_lane: { LEFT: 0, RIGHT: 0 },
  heatmap_accumulated: "heatmap.jpg",
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heatmapError, setHeatmapError] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
      setAnalytics(defaultAnalytics);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const data = analytics ?? defaultAnalytics;
  const leftViolations = data.violations_per_lane.LEFT ?? 0;
  const rightViolations = data.violations_per_lane.RIGHT ?? 0;
  const maxViolations = Math.max(leftViolations, rightViolations, 1);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          AI Traffic Monitoring Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-3 py-1.5 text-sm rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white"
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
          <Link
            to="/dashboard/wrong-way"
            className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            Wrong-Way Detection
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white/5 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-cyan-500/10">
          <h2 className="mb-3 sm:mb-4 font-semibold text-white text-sm sm:text-base">
            Total videos processed
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-cyan-400">{data.total_videos_processed}</p>
        </div>
        <div className="bg-white/5 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-cyan-500/10">
          <h2 className="mb-3 sm:mb-4 font-semibold text-white text-sm sm:text-base">
            Total tracked vehicles
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-cyan-400">{data.total_tracked_vehicles}</p>
        </div>
        <div className="bg-white/5 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-cyan-500/10">
          <h2 className="mb-3 sm:mb-4 font-semibold text-white text-sm sm:text-base">
            Total wrong-way count
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-red-400">{data.total_wrong_way}</p>
        </div>
        <div className="bg-white/5 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-cyan-500/10">
          <h2 className="mb-3 sm:mb-4 font-semibold text-white text-sm sm:text-base">
            Total lane changes
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-cyan-400">{data.total_lane_changes}</p>
        </div>

        <div className="xl:col-span-2 bg-white/5 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-cyan-500/10">
          <h2 className="mb-3 sm:mb-4 font-semibold text-white text-sm sm:text-base">
            Violations per lane
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-14 text-sm font-medium text-gray-300">LEFT</span>
              <div className="flex-1 h-6 bg-black/30 rounded-md overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-md transition-all duration-300"
                  style={{ width: `${(leftViolations / maxViolations) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-white w-8">{leftViolations}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-14 text-sm font-medium text-gray-300">RIGHT</span>
              <div className="flex-1 h-6 bg-black/30 rounded-md overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-md transition-all duration-300"
                  style={{ width: `${(rightViolations / maxViolations) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-white w-8">{rightViolations}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-green-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-green-500/10">
          <h2 className="mb-3 sm:mb-4 font-semibold text-white text-sm sm:text-base">
            AI System Status
          </h2>
          <p className="text-green-400 font-semibold text-sm sm:text-base">
            All monitoring modules active
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Process videos in Wrong-Way Detection to update cumulative analytics.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white/5 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-cyan-500/10">
        <h2 className="mb-2 font-semibold text-white text-sm sm:text-base">
          Wrong-way activity heatmap (cumulative)
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mb-3">
          Red areas indicate high violation concentration across all processed videos.
        </p>
        <div className="max-w-3xl rounded-lg overflow-hidden bg-black/30 border border-white/10">
          {loading ? (
            <div className="aspect-video flex items-center justify-center text-gray-400">
              Loading heatmap…
            </div>
          ) : heatmapError ? (
            <div className="aspect-video flex items-center justify-center text-gray-400 text-sm p-4">
              No heatmap yet. Process a video in Wrong-Way Detection.
            </div>
          ) : (
            <img
              src={`${API_BASE}/heatmap?t=${Date.now()}`}
              alt="Cumulative wrong-way heatmap"
              className="w-full h-auto block"
              onError={() => setHeatmapError(true)}
            />
          )}
        </div>
      </div>
    </>
  );
}
