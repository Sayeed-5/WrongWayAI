// @ts-nocheck - react-leaflet type definitions
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const socket = io(SOCKET_URL);

export default function LiveMonitoring() {
  const [incident, setIncident] = useState(false);
  const [plateData, setPlateData] = useState("ABC1234");
  const [vehicleCount, setVehicleCount] = useState(32);

  useEffect(() => {
    socket.on("traffic-update", (data: { vehicles: number; wrongWay: boolean; plate: string }) => {
      setVehicleCount(data.vehicles);
      setIncident(data.wrongWay);
      setPlateData(data.plate);
    });
    return () => {
      socket.off("traffic-update");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-4 sm:p-6">
      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6">
        🚦 Live Traffic Monitoring
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-8 bg-white/5 border border-cyan-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 relative">
          <video
            src="/traffic.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-[220px] sm:h-[300px] lg:h-[400px] object-cover rounded-lg"
          />
          {incident && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-16 left-1/4 sm:top-20 sm:left-1/3 lg:top-24 lg:left-40 w-32 h-20 sm:w-40 sm:h-24 lg:w-48 lg:h-28 border-4 border-red-500"
            >
              <motion.div
                className="absolute inset-0 bg-red-500/20"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          )}
          {incident && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-600 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
            >
              <AlertTriangle />
              WRONG WAY DETECTED
            </motion.div>
          )}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-300">
            <span>Vehicles Detected: {vehicleCount}</span>
            <span className="text-red-400">Status: {incident ? "Violation" : "Normal Flow"}</span>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-3 sm:p-4">
            <h3 className="text-cyan-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">ANPR Snapshot</h3>
            <div className="h-20 sm:h-24 bg-black/40 rounded-md flex items-center justify-center">Plate Image</div>
            <div className="text-xs sm:text-sm mt-2 sm:mt-3 space-y-1">
              <p>Plate: {plateData}</p>
              <p>Captured: Live</p>
            </div>
          </div>

          <div className="bg-white/5 border border-green-500/20 rounded-xl p-3 sm:p-4">
            <h3 className="text-green-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Incident Location</h3>
            <div className="h-[180px] sm:h-[200px] w-full rounded-md overflow-hidden">
              <MapContainer
                center={[20.2961, 85.8245]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {incident && <Marker position={[20.2961, 85.8245]}><Popup>Wrong Way Vehicle Detected</Popup></Marker>}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
