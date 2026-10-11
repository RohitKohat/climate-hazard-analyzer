import { Thermometer } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header({ theme, toggle }) {
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md"
      style={{ borderBottom: "1px solid var(--panel-border)" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
          >
            <Thermometer size={16} color="white" />
          </div>
          <div className="leading-tight">
            <div className="display text-sm font-semibold">Thermal Observatory</div>
            <div
              className="mono text-[10px] uppercase tracking-widest"
              style={{ color: "var(--text-faint)" }}
            >
              climate hazard analyzer
            </div>
          </div>
        </div>
        <ThemeToggle theme={theme} toggle={toggle} />
      </div>
    </header>
  );
}