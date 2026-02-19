import type { UploadResponse } from "../../services/api";
import { API_BASE } from "../../services/api";

interface DashboardProps {
  data: UploadResponse | null;
}

export default function Dashboard({ data }: DashboardProps) {
  if (!data) {
    return (
      <section className="wrongway-section">
        <h2 className="wrongway-heading">Dashboard</h2>
        <p className="wrongway-muted">Upload a video to see stats.</p>
      </section>
    );
  }

  const violationCount = data.violations.length;
  const laneChangeCount = data.lane_changes.length;

  const violationsByLane = data.violations.reduce(
    (acc, v) => {
      acc[v.lane] = (acc[v.lane] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const leftViolations = violationsByLane.LEFT ?? 0;
  const rightViolations = violationsByLane.RIGHT ?? 0;
  const maxViolations = Math.max(leftViolations, rightViolations, 1);

  return (
    <section className="wrongway-section">
      <h2 className="wrongway-heading">Dashboard</h2>

      <div className="wrongway-dashboard-grid">
        <div className="wrongway-stat-card">
          <span className="wrongway-stat-value">{data.total_tracked_vehicles}</span>
          <span className="wrongway-stat-label">Total tracked vehicles</span>
        </div>
        <div className="wrongway-stat-card wrongway-stat-wrong">
          <span className="wrongway-stat-value">{data.wrong_way_count}</span>
          <span className="wrongway-stat-label">Wrong-way count</span>
        </div>
        <div className="wrongway-stat-card">
          <span className="wrongway-stat-value">{laneChangeCount}</span>
          <span className="wrongway-stat-label">Total lane changes</span>
        </div>
        <div className="wrongway-stat-card">
          <span className="wrongway-stat-value">{violationCount}</span>
          <span className="wrongway-stat-label">Violation count</span>
        </div>
      </div>

      <div className="wrongway-heatmap-block">
        <h3 className="wrongway-subheading">Wrong Way Activity Heatmap</h3>
        <p className="wrongway-muted wrongway-heatmap-caption">
          Red areas indicate high violation concentration.
        </p>
        <div className="wrongway-heatmap-img-wrap">
          <img
            src={`${API_BASE}${data.heatmap_url}`}
            alt="Wrong-way activity heatmap"
            className="wrongway-heatmap-img"
          />
        </div>
      </div>

      <div className="wrongway-charts">
        <div className="wrongway-chart-block">
          <h3 className="wrongway-subheading">Violations per lane</h3>
          <div className="wrongway-bar-chart">
            <div className="wrongway-bar-row">
              <span className="wrongway-bar-label">LEFT</span>
              <div className="wrongway-bar-track">
                <div
                  className="wrongway-bar-fill wrongway-bar-left"
                  style={{ width: `${(leftViolations / maxViolations) * 100}%` }}
                />
              </div>
              <span className="wrongway-bar-value">{leftViolations}</span>
            </div>
            <div className="wrongway-bar-row">
              <span className="wrongway-bar-label">RIGHT</span>
              <div className="wrongway-bar-track">
                <div
                  className="wrongway-bar-fill wrongway-bar-right"
                  style={{ width: `${(rightViolations / maxViolations) * 100}%` }}
                />
              </div>
              <span className="wrongway-bar-value">{rightViolations}</span>
            </div>
          </div>
        </div>
        <div className="wrongway-chart-block">
          <h3 className="wrongway-subheading">Lane change count</h3>
          <div className="wrongway-single-bar">
            <div
              className="wrongway-bar-fill wrongway-bar-lane"
              style={{ width: `${Math.min(100, laneChangeCount * 10)}%` }}
            />
          </div>
          <p className="wrongway-muted wrongway-chart-value">{laneChangeCount} lane changes</p>
        </div>
      </div>
    </section>
  );
}
