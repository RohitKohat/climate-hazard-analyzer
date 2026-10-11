import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle({ theme, toggle }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-14 h-8 rounded-full glass flex items-center px-1 cursor-pointer"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          marginLeft: isDark ? "auto" : 0,
          background: isDark
            ? "linear-gradient(135deg,#f97316,#ef4444)"
            : "linear-gradient(135deg,#fde68a,#f59e0b)",
        }}
      >
        {isDark ? <Moon size={12} color="#0a0a0f" /> : <Sun size={12} color="#1c1917" />}
      </motion.div>
    </button>
  );
}