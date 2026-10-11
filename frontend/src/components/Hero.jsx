export default function Hero() {
  return (
    <section className="pt-10 pb-6 fade-up">
      <p className="mono text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--text-faint)" }}>
        ── heatwave signal analysis
      </p>
      <h1 className="display text-4xl md:text-6xl font-bold mt-3 leading-[1.05]">
        Read the <span className="thermal-text">thermal</span> pulse
        <br /> of any region on Earth.
      </h1>
      <p className="mt-4 max-w-xl text-sm md:text-base" style={{ color: "var(--text-dim)" }}>
        Detects heatwave events using the 95<sup>th</sup>-percentile rule on daily maximum
        temperature, then quantifies how the signal has shifted over decades.
      </p>
    </section>
  );
}