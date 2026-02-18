import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Camera,
  AlertTriangle,
  ScanLine,
  FileText,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface MenuItem {
  name: string;
  icon: typeof LayoutDashboard;
  path?: string;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Live Monitoring", path: "/dashboard/live", icon: Camera },
  { name: "Wrong-Way Detection", path: "/dashboard/wrong-way", icon: AlertTriangle },
  { name: "Violation Reports", path: "/dashboard/violations", icon: FileText },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed lg:sticky top-0 left-0 z-50 h-screen shrink-0 bg-[#0f172a] border-r border-blue-500/20 backdrop-blur-xl flex flex-col shadow-lg shadow-blue-500/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
        {!collapsed && (
          <a href='/' className="min-w-0">
            <b><span className='text-xl sm:text-2xl'>🚦</span>Wrong<span className='text-green-400 text-lg sm:text-xl'>WayAI</span></b>
          </a>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex text-gray-400 hover:text-white transition"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <button
            onClick={() => onClose?.()}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 mt-6 space-y-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const path = item.path ?? null;
          const isActive = path ? location.pathname === path : false;

          const content = (
            <>
              <Icon size={20} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </>
          );

          const className = `flex items-center gap-4 px-4 py-3 rounded-xl transition ${
            isActive
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-md shadow-blue-500/20"
              : "text-gray-300 hover:bg-white/5"
          }`;

          if (path) {
            return (
              <Link to={path} key={item.name} onClick={handleLinkClick}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`${className} cursor-pointer`}
                >
                  {content}
                </motion.div>
              </Link>
            );
          }

          return (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.05 }}
              className={`${className} cursor-default opacity-70`}
            >
              {content}
            </motion.div>
          );
        })}
      </div>

      {!collapsed && (
        <div className="p-6 border-t border-white/10 text-xs text-gray-500">
          Protected by AI-Based Threat Detection
        </div>
      )}
    </motion.aside>
  );
}
