import Card from "../ui/Card";
import Button from "../ui/Button";
import { Download, Printer } from "lucide-react";

export default function SummaryCard({ data }) {
  const downloadCSV = () => {
    if (!data?.events?.length) return;

    const headers = ["Start Date", "End Date", "Duration (Days)", "Mean Temp (C)", "Max Temp (C)"];
    const rows = data.events.map(e => [
      e.start, e.end, e.duration, e.mean_intensity, e.max_temp,
    ]);

    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `heatwave_events_${data.lat}_${data.lon}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="fade-up">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <div className="mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
            insight
          </div>
          <p className="display text-lg md:text-2xl leading-snug">{data.summary}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: "var(--text-dim)" }}>
            <span>Threshold <span className="mono" style={{ color: "var(--accent)" }}>{data.threshold_c}°C</span></span>
            <span>Trend <span className="mono" style={{ color: "var(--accent)" }}>{data.trend.direction}</span></span>
            <span>Slope <span className="mono" style={{ color: "var(--accent)" }}>{data.trend.slope}/yr</span></span>
            <span>p-value <span className="mono" style={{ color: "var(--accent)" }}>{data.trend.p_value}</span></span>
            {data.trend?.mann_kendall?.trend && (
              <span>Mann–Kendall <span className="mono" style={{ color: "var(--accent)" }}>{data.trend.mann_kendall.trend}</span></span>
            )}
          </div>
        </div>

        <div className="flex gap-2 no-print">
          <Button variant="ghost" onClick={downloadCSV} className="flex items-center gap-2 shrink-0">
            <Download size={14} /> CSV
          </Button>
          <Button variant="ghost" onClick={() => window.print()} className="flex items-center gap-2 shrink-0">
            <Printer size={14} /> PDF
          </Button>
        </div>
      </div>
    </Card>
  );
}