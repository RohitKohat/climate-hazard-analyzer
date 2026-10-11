import Card from "../ui/Card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <div className="mono" style={{ color: "var(--text-faint)" }}>{label}</div>
      <div className="display text-base">{payload[0].value} days</div>
    </div>
  );
}

export default function TrendChart({ data }) {
  return (
    <Card className="fade-up">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="display text-base font-semibold">Annual heatwave days</h3>
        <span className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
          total_days / year
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data.annual}>
          <defs>
            <linearGradient id="heatFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.55} />
              <stop offset="60%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 6" vertical={false} />
          <XAxis dataKey="year" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--accent)", strokeDasharray: "2 4" }} />
          <Area type="monotone" dataKey="total_days" stroke="#f97316" strokeWidth={2} fill="url(#heatFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}