import { useRef, useState } from "react";

interface UploadProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
  error: string | null;
}

export default function Upload({ onFileSelect, loading, error }: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) onFileSelect(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      onFileSelect(file);
    }
  };

  return (
    <section className="wrongway-section">
      <h2 className="wrongway-heading">Upload Video</h2>

      <div
        className={`wrongway-upload-box ${isDragOver ? 'drag-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !loading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="wrongway-input-hidden"
          aria-label="Choose video"
        />

        {loading && (
          <div className="wrongway-loading-overlay">
            <span className="wrongway-loader"></span>
            <p className="text-sm text-gray-300">Processing video...</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 py-8">
          <div className="p-4 rounded-full bg-white/5 text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-white mb-1">
              {isDragOver ? "Drop video here" : "Drag & drop video here"}
            </p>
            <p className="text-sm text-gray-400">
              or click to browse
            </p>
          </div>
        </div>

        {error && <p className="wrongway-error mt-4 relative z-20">{error}</p>}
      </div>
    </section>
  );
}
