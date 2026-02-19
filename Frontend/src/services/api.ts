export const API_BASE = "http://localhost:8000";

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

export interface Violation {
  id: number;
  track_id: number;
  timestamp: number;
  image_path: string;
  video_timestamp: string;
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
