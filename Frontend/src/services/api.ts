export const API_BASE = "https://wrongwayai.onrender.com";

export interface Analytics {
  total_videos_processed: number;
  total_tracked_vehicles: number;
  total_wrong_way: number;
  total_lane_changes: number;
  violations_per_lane: { LEFT: number; RIGHT: number };
  heatmap_accumulated: string;
} 

export async function getAnalytics(): Promise<Analytics> {
  const response = await fetch(`${API_BASE}/analytics`);
  if (!response.ok) throw new Error(`Failed to load analytics (${response.status})`);
  return response.json() as Promise<Analytics>;
}

export async function resetAnalytics(): Promise<void> {
  const response = await fetch(`${API_BASE}/reset`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Failed to reset analytics (${response.status})`);
  }
}

export interface ViolationItem {
  track_id: number;
  lane: "LEFT" | "RIGHT";
  direction_detected: "UP" | "DOWN";
  timestamp_ms: number;
  evidence_image_url: string;
}

export interface LaneChangeItem {
  track_id: number;
  from_lane: "LEFT" | "RIGHT";
  to_lane: "LEFT" | "RIGHT";
  timestamp_ms: number;
}

export interface UploadResponse {
  video_url: string;
  heatmap_url: string;
  total_tracked_vehicles: number;
  wrong_way_count: number;
  violations: ViolationItem[];
  lane_changes: LaneChangeItem[];
}

/** Violation from GET /violations (file-based, no DB). */
export interface Violation {
  id: number;
  filename: string;
  image_path: string;
}

export async function uploadVideo(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/upload/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message =
      (errData as { detail?: string }).detail ||
      `Upload failed (${response.status})`;
    throw new Error(message);
  }

  const data = (await response.json()) as UploadResponse;
  if (!data.video_url) {
    throw new Error("No video URL in response");
  }
  return data;
}

export async function getViolations(): Promise<Violation[]> {
  const response = await fetch(`${API_BASE}/violations`);

  if (!response.ok) {
    throw new Error(`Failed to load violations (${response.status})`);
  }

  const data = (await response.json()) as Violation[];
  return data;
}

export async function deleteViolation(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/violations/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message =
      (errData as { detail?: string }).detail ||
      `Failed to delete violation (${response.status})`;
    throw new Error(message);
  }
}

/** Delete a violation image file by filename (e.g. violation_123_1.jpg). */
export async function deleteViolationImage(filename: string): Promise<void> {
  const response = await fetch(
    `${API_BASE}/violation-image?filename=${encodeURIComponent(filename)}`,
    { method: "DELETE" }
  );
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message =
      (errData as { detail?: string }).detail ||
      `Failed to delete image (${response.status})`;
    throw new Error(message);
  }
}
