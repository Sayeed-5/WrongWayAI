import { useRef } from "react";

interface UploadProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
  error: string | null;
}

export default function Upload({ onFileSelect, loading, error }: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) onFileSelect(file);
    e.target.value = "";
  };

  return (
    <section className="wrongway-section">
      <h2 className="wrongway-heading">Upload Video</h2>
      <div className="wrongway-upload-box">
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="wrongway-input-hidden"
          aria-label="Choose video"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="wrongway-btn wrongway-btn-primary"
        >
          {loading ? "Processing…" : "Choose video file"}
        </button>
        {error && <p className="wrongway-error">{error}</p>}
      </div>
    </section>
  );
}
