import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ScanLine } from "lucide-react";

interface PlateData {
  plate: string;
  confidence: number;
  vehicleType: string;
  time: string;
}

export default function NumberPlateRecognition() {
  const [scanning, setScanning] = useState(false);
  const [detectedPlate, setDetectedPlate] = useState<PlateData | null>(null);
  const [history, setHistory] = useState<PlateData[]>([]);

  const startScan = () => {
    setScanning(true);
    setDetectedPlate(null);
    setTimeout(() => {
      const newPlate: PlateData = {
        plate: "OD02AB" + Math.floor(1000 + Math.random() * 9000),
        confidence: Math.floor(85 + Math.random() * 10),
        vehicleType: Math.random() > 0.5 ? "Sedan" : "Motorcycle",
        time: new Date().toLocaleTimeString(),
      };
      setDetectedPlate(newPlate);
      setHistory((prev) => [newPlate, ...prev.slice(0, 4)]);
      setScanning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2">
          🚘 Number Plate Recognition (ANPR)
        </h1>
        <button onClick={startScan} disabled={scanning} className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition text-sm sm:text-base">
          {scanning ? "Scanning..." : "Start Plate Scan"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-8 bg-white/5 border border-cyan-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 relative">
          <video src="/traffic.mp4" autoPlay muted loop controls playsInline className="w-full h-[220px] sm:h-[300px] lg:h-[400px] object-cover rounded-lg sm:rounded-xl" />
          {scanning && (
            <motion.div initial={{ top: 0 }} animate={{ top: "80%" }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} className="absolute left-0 w-full h-1 bg-cyan-400" />
          )}
          {detectedPlate && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-16 left-1/4 sm:bottom-20 sm:left-1/3 lg:bottom-24 lg:left-52 w-48 h-14 sm:w-56 sm:h-16 lg:w-64 lg:h-20 border-4 border-green-400 rounded-md" />
          )}
        </div>

        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="bg-white/5 border border-green-500/20 rounded-xl p-3 sm:p-4">
            <h3 className="text-green-400 font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <ScanLine size={16} className="sm:size-[18px]" /> Detected Plate
            </h3>
            <AnimatePresence>
              {detectedPlate ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 text-xs sm:text-sm">
                  <p className="text-lg sm:text-xl font-bold tracking-widest text-green-400">{detectedPlate.plate}</p>
                  <p>Confidence: {detectedPlate.confidence}%</p>
                  <p>Vehicle Type: {detectedPlate.vehicleType}</p>
                  <p>Captured: {detectedPlate.time}</p>
                </motion.div>
              ) : (
                <p className="text-gray-400 text-sm">No plate detected yet.</p>
              )}
            </AnimatePresence>
          </div>
          <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-3 sm:p-4">
            <h3 className="text-cyan-400 font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Camera size={16} className="sm:size-[18px]" /> Recent Captures
            </h3>
            <ul className="text-xs sm:text-sm space-y-1.5 sm:space-y-2 text-gray-300">
              {history.length === 0 ? <li>No recent captures</li> : history.map((item, index) => (
                <li key={index} className="flex justify-between"><span>{item.plate}</span><span className="text-xs text-gray-500">{item.time}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
