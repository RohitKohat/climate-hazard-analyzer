import Card from "../ui/Card";

export default function EventsTable({ events }) {
  return (
    <Card className="fade-up">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="display text-base font-semibold">Detected events</h3>
        <span className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
          {events.length} total
        </span>
      </div>
      <div className="max-h-80 overflow-auto rounded-lg" style={{ border: "1px solid var(--panel-border)" }}>
        <table className="w-full text-xs mono">
          <thead className="sticky top-0" style={{ background: "var(--bg-elev)" }}>
            <tr className="text-left uppercase tracking-widest text-[10px]" style={{ color: "var(--text-faint)" }}>
              <th className="p-3">start</th>
              <th className="p-3">end</th>
              <th className="p-3">days</th>
              <th className="p-3">mean°C</th>
              <th className="p-3">max°C</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--panel-border)" }}>
                <td className="p-3">{e.start}</td>
                <td className="p-3">{e.end}</td>
                <td className="p-3" style={{ color: "var(--accent)" }}>{e.duration}</td>
                <td className="p-3">{e.mean_intensity}</td>
                <td className="p-3">{e.max_temp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}