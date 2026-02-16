const API_BASE = "http://localhost:8000";

export interface UploadResponse {
  video_url: string;
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
