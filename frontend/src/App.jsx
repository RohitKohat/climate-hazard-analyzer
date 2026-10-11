import { useState } from "react";
import { useTheme } from "./hooks/useTheme";
import Background from "./components/Background";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ConfigPanel from "./components/ConfigPanel";
import LoadingState from "./components/LoadingState";
import StatGrid from "./components/results/StatGrid";
import SummaryCard from "./components/results/SummaryCard";
import TrendChart from "./components/results/TrendChart";
import EventsChart from "./components/results/EventsChart";
import EventsTable from "./components/results/EventsTable";
import { analyze } from "./api";

export default function App() {
  const { theme, toggle } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function run(payload) {
    setLoading(true); setError(null); setData(null);
    try {
      setData(await analyze(payload));
    } catch (e) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Background />
      <Header theme={theme} toggle={toggle} />

      <main className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <Hero />
        <ConfigPanel onRun={run} loading={loading} />

        <div className="mt-8 space-y-4">
          {error && (
            <div className="glass rounded-2xl p-4 text-sm fade-up" style={{ color: "#ef4444" }}>
              {error}
            </div>
          )}
          {loading && <LoadingState />}

          {data && !loading && (
            <>
              <SummaryCard data={data} />
              <StatGrid data={data} />
              <div className="grid lg:grid-cols-2 gap-4">
                <TrendChart data={data} />
                <EventsChart data={data} />
              </div>
              <EventsTable events={data.events} />
            </>
          )}
        </div>

        <footer
          className="mt-16 text-center mono text-[10px] uppercase tracking-widest"
          style={{ color: "var(--text-faint)" }}
        >
          data · open-meteo archive · 95th-percentile rule
        </footer>
      </main>
    </>
  );
}