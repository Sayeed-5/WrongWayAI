import { useState, useEffect } from "react";
import { Camera, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [violationIndex, setViolationIndex] = useState(35);

  useEffect(() => {
    const storedIndex = localStorage.getItem("violationIndex");
    if (storedIndex) setViolationIndex(Number(storedIndex));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setViolationIndex((prev) => {
        const change = Math.floor(Math.random() * 10 - 5);
        let newScore = prev + change;
        if (newScore < 5) newScore = 5;
        if (newScore > 95) newScore = 95;
        return newScore;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Wrong-Way Violations",
      data: [5, 8, 6, 10, 12, 9, 14],
      borderColor: "#06b6d4",
      backgroundColor: "rgba(6,182,212,0.3)",
      tension: 0.4,
    }],
  };

  const doughnutData = {
    labels: ["Safe Flow", "Violations"],
    datasets: [{
      data: [100 - violationIndex, violationIndex],
      backgroundColor: ["#22c55e", "#ef4444"],
      borderWidth: 0,
    }],
  };

  return (
    <>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 text-white">
        AI Traffic Monitoring Dashboard
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          className="bg-white/5 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-cyan-500/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="mb-3 sm:mb-4 font-semibold flex items-center gap-2 text-white text-sm sm:text-base">
            <Camera className="text-cyan-400 size-4 sm:size-5" />
            Violation Index
          </h2>
          <div className="w-36 sm:w-44 lg:w-48 mx-auto max-h-[180px] sm:max-h-[220px]">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: true }} />
          </div>
          <p className={`text-center mt-3 sm:mt-4 text-base sm:text-lg font-bold ${violationIndex > 60 ? "text-red-400" : violationIndex > 40 ? "text-yellow-400" : "text-green-400"}`}>
            Current Violation Rate: {violationIndex}%
          </p>
        </motion.div>

        <div className="bg-white/5 border border-cyan-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-cyan-500/10 xl:col-span-2 min-w-0 overflow-hidden">
          <h2 className="mb-3 sm:mb-4 font-semibold text-white text-sm sm:text-base">
            Weekly Wrong-Way Analytics
          </h2>
          <div className="h-[200px] sm:h-[250px] lg:h-[280px]">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white/5 border border-red-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-red-500/10">
          <h2 className="mb-3 sm:mb-4 font-semibold flex items-center gap-2 text-white text-sm sm:text-base">
            <AlertTriangle className="text-red-400 size-4 sm:size-5" />
            Live Traffic Alerts
          </h2>
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
            <li>🚨 Wrong-way vehicle detected - NH16</li>
            <li>🚗 Speed violation flagged - City Bypass</li>
            <li>📸 Number plate extracted successfully</li>
          </ul>
        </div>

        <div className="bg-white/5 border border-green-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-lg shadow-lg shadow-green-500/10">
          <h2 className="mb-3 sm:mb-4 font-semibold text-white text-sm sm:text-base">
            AI System Status
          </h2>
          <p className="text-green-400 font-semibold text-sm sm:text-base">
            All Monitoring Modules Active
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Real-time video analysis, ANPR detection, and violation reporting system operating normally.
          </p>
        </div>
      </div>
    </>
  );
}
