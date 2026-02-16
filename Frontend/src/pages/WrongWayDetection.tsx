import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, Activity } from "lucide-react";

export default function WrongWayDetection() {
  const [wrongWayDetected, setWrongWayDetected] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(24);
  const [violations, setViolations] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const detected = Math.random() > 0.7;
      setWrongWayDetected(detected);
      if (detected) setViolations((prev) => prev + 1);
      setVehicleCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2">
          🚦 Wrong-Way Detection System
        </h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-green-400">
          <ShieldCheck size={16} className="sm:size-[18px]" />
          AI Monitoring Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-8 bg-white/5 border border-cyan-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 relative">
          <video src="/traffic.mp4" autoPlay muted loop controls playsInline className="w-full h-[220px] sm:h-[300px] lg:h-[400px] object-cover rounded-lg sm:rounded-xl" />
          {wrongWayDetected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-20 left-1/4 sm:top-24 sm:left-1/3 lg:top-28 lg:left-44 w-36 h-20 sm:w-44 sm:h-28 lg:w-56 lg:h-32 border-4 border-red-500 rounded-md">
              <motion.div className="absolute inset-0 bg-red-500/20" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 1, repeat: Infinity }} />
            </motion.div>
          )}
          <AnimatePresence>
            {wrongWayDetected && (
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-600 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm shadow-lg">
                <AlertTriangle /> WRONG WAY VEHICLE DETECTED
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-300">
            <span>Total Vehicles: {vehicleCount}</span>
            <span className="text-red-400">Violations: {violations}</span>
            <span>Status: <span className={wrongWayDetected ? "text-red-400" : "text-green-400"}>{wrongWayDetected ? "Alert" : "Normal"}</span></span>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="bg-white/5 border border-blue-500/20 rounded-xl p-3 sm:p-4">
            <h3 className="text-blue-400 font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Activity size={16} className="sm:size-[18px]" /> Lane Direction Monitor
            </h3>
            <div className="flex justify-between text-xs sm:text-sm text-gray-300">
              <span>Expected Direction</span>
              <span className="text-green-400">→ Forward</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-300 mt-2">
              <span>Detected Motion</span>
              <span className={wrongWayDetected ? "text-red-400" : "text-green-400"}>{wrongWayDetected ? "← Reverse" : "→ Forward"}</span>
            </div>
          </div>
          <div className="bg-white/5 border border-red-500/20 rounded-xl p-3 sm:p-4">
            <h3 className="text-red-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Recent Violations</h3>
            <ul className="text-xs sm:text-sm space-y-1.5 sm:space-y-2 text-gray-300">
              {violations === 0 ? <li>No violations detected</li> : Array.from({ length: violations }).map((_, i) => (
                <li key={i}>🚨 Wrong-Way Vehicle #{i + 1} Detected</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
