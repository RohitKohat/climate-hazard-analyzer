import Card from "../ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

export default function EventsChart({ data }) {
  const max = Math.max(...data.annual.map(a => a.events), 1);
  return (
    <Card className="fade-up">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="display text-base font-semibold">Events per year</h3>
        <span className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
          count
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data.annual}>
          <CartesianGrid strokeDasharray="2 6" vertical={false} />
          <XAxis dataKey="year" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} width={30} />
          <Tooltip
            cursor={{ fill: "var(--accent-soft)" }}
            contentStyle={{
              background: "var(--bg-elev)",
              border: "1px solid var(--panel-border)",
              borderRadius: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="events" radius={[4, 4, 0, 0]}>
            {data.annual.map((a, i) => {
              const t = a.events / max;
              const color = t < 0.34 ? "#22d3ee" : t < 0.67 ? "#f59e0b" : "#ef4444";
              return <Cell key={i} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}