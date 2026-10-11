import Card from "../ui/Card";
import NumberTicker from "../ui/NumberTicker";
import { Flame, Activity, TrendingUp, Percent } from "lucide-react";

export default function StatGrid({ data }) {
  const totalEvents = data.events.length;
  const totalDays = data.annual.reduce((s, a) => s + a.total_days, 0);
  const avgDur = totalEvents ? totalDays / totalEvents : 0;
  const pct = data.trend?.percent_change?.percent_change;

  const items = [
    { label: "Heatwave events", value: totalEvents, icon: Flame, decimals: 0 },
    { label: "Total heat days", value: totalDays, icon: Activity, decimals: 0 },
    { label: "Avg duration (d)", value: avgDur, icon: TrendingUp, decimals: 1 },
    { label: "Δ since start", value: pct ?? 0, icon: Percent, decimals: 1, suffix: "%" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it, i) => (
        <Card key={i} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="flex items-center justify-between">
            <span className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
              {it.label}
            </span>
            <it.icon size={12} style={{ color: "var(--accent)" }} />
          </div>
          <div className="display text-3xl mt-3">
            <NumberTicker value={it.value} decimals={it.decimals} suffix={it.suffix || ""} />
          </div>
        </Card>
      ))}
    </div>
  );
}