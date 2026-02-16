import { UploadCloud, Video, Cpu, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Selected: ${file.name}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/traffic img.png')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-900/70 to-black/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-28 pb-20">

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          AI Traffic Violation Detection System
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-gray-300 text-base md:text-lg">
          Automatically Detect Wrong-Way Driving from Traffic Videos
        </p>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Feature Buttons Bar */}
        <div className="mt-6 flex flex-wrap gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 max-w-3xl">

          {/* Upload Button */}
          <button
            onClick={openFilePicker}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Video className="w-4 h-4" />
            Upload Traffic Video
          </button>

          {/* AI Detection */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition">
            <Cpu className="w-4 h-4" />
            AI Detection of Violations
          </button>

          {/* Report */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition">
            <FileText className="w-4 h-4" />
            Generate Detailed Report
          </button>
        </div>

        {/* Upload + Preview Section */}
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">

          {/* Upload Card */}
          <div className="relative group max-w-md mx-auto">

  {/* Glow Border Effect */}
  <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500"></div>

  {/* Main Card */}
  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 text-center shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">

    {/* Icon Circle */}
    <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg mb-6">
      <UploadCloud className="w-10 h-10 text-white" />
    </div>

    {/* Title */}
    <h3 className="text-2xl font-semibold text-white">
      Upload Traffic Video
    </h3>

    {/* Subtitle */}
    <p className="text-gray-300 text-sm mt-3">
      Supported formats: mp4, avi, mov
    </p>

    {/* Button */}
    <button
      onClick={openFilePicker}
      className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium shadow-lg transition-all duration-300 hover:shadow-blue-500/40"
    >
      Choose Video File
    </button>

    {/* Drag text */}
    <p className="text-xs text-gray-400 mt-4">
      or drag & drop file here
    </p>

  </div>
</div>


          {/* Preview UI */}
          <div className="relative text-center">

            <div className="border-4 border-red-500 rounded-xl p-2 max-w-xs mx-auto">

              <div className="bg-red-500 text-white text-center py-1 rounded-t-lg font-semibold">
                WRONG WAY!
              </div>

              <img
                src="/traffic img 1.png"
                alt="Violation"
                className="w-full rounded-b-lg"
              />
            </div>

            <div className="mt-4 bg-red-500 text-white py-2 rounded-lg font-semibold max-w-xs mx-auto">
              Violation Detected
            </div>

            <div className="mt-3 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium max-w-xs mx-auto">
              MH 04 AB 1234
            </div>

          </div>
        </div>

        {/* Bottom Tagline Section */}
        <div className="mt-16 text-center">

          <h2 className="text-xl md:text-2xl text-white font-semibold">
            Enhance Road Safety with AI-Powered, Real-Time Monitoring
          </h2>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg shadow-lg transition">
            Get Started
          </button>

        </div>

      </div>
    </section>
  );
}
