import Card from "./ui/Card";

export default function LoadingState() {
  return (
    <Card className="scanline relative h-40 flex items-center justify-center overflow-hidden">
      <div className="mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
        fetching archive · computing threshold · scanning streaks
      </div>
    </Card>
  );
}