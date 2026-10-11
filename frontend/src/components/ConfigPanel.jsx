import { useState } from "react";
import { MapPin, CalendarRange, Play, Square, Circle } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import CitySearch from "./CitySearch";
import MapPicker from "./MapPicker";

export default function ConfigPanel({ onRun, loading }) {
  const [mode, setMode] = useState("point");
  const [lat, setLat] = useState(28.6);
  const [lon, setLon] = useState(77.2);
  const [minLat, setMinLat] = useState(18.9);
  const [maxLat, setMaxLat] = useState(19.3);
  const [minLon, setMinLon] = useState(72.7);
  const [maxLon, setMaxLon] = useState(73.1);
  const [start, setStart] = useState(1990);
  const [end, setEnd] = useState(2020);
  const [locationLabel, setLocationLabel] = useState("Delhi, India");

  const handleCitySelect = ({ lat, lon, label }) => {
    setLat(lat);
    setLon(lon);
    setLocationLabel(label);
    setMinLat(+(lat - 0.2).toFixed(4));
    setMaxLat(+(lat + 0.2).toFixed(4));
    setMinLon(+(lon - 0.2).toFixed(4));
    setMaxLon(+(lon + 0.2).toFixed(4));
  };

  const handleMapPick = (coords) => {
    if (mode === "point") {
      setLat(coords.lat);
      setLon(coords.lon);
      setLocationLabel(`Custom (${coords.lat}, ${coords.lon})`);
    } else {
      setMinLat(coords.minLat);
      setMaxLat(coords.maxLat);
      setMinLon(coords.minLon);
      setMaxLon(coords.maxLon);
      setLat((coords.minLat + coords.maxLat) / 2);
      setLon((coords.minLon + coords.maxLon) / 2);
      setLocationLabel("Custom box");
    }
  };

  const inputCls = "mt-2 w-full bg-transparent border-b mono text-lg py-1 outline-none focus:border-orange-500";
  const labelCls = "mono text-[10px] uppercase tracking-widest";

  const handleRun = () => {
    const base = {
      start_year: start, end_year: end,
      hazard: "heatwave", percentile: 95, min_duration: 3,
      location_label: locationLabel,
    };
    if (mode === "box") {
      onRun({
        ...base,
        lat, lon,
        mode: "box",
        min_lat: minLat, max_lat: maxLat,
        min_lon: minLon, max_lon: maxLon,
      });
    } else {
      onRun({ ...base, lat, lon, mode: "point" });
    }
  };

  return (
    <Card className="fade-up space-y-5">
      {/* Search */}
      <div>
        <label className={labelCls} style={{ color: "var(--text-faint)" }}>Search Region</label>
        <div className="mt-2">
          <CitySearch onSelect={handleCitySelect} />
        </div>
        {locationLabel && (
          <p className="mono text-[10px] mt-1" style={{ color: "var(--accent)" }}>
            📍 {locationLabel}
          </p>
        )}
      </div>

      {/* Interactive map */}
      <MapPicker
        mode={mode}
        center={[lat, lon]}
        box={{ minLat, maxLat, minLon, maxLon }}
        onPick={handleMapPick}
      />

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("point")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs mono uppercase tracking-widest cursor-pointer transition-all"
          style={{
            background: mode === "point" ? "var(--accent-soft)" : "transparent",
            color: mode === "point" ? "var(--accent)" : "var(--text-faint)",
            border: "1px solid var(--panel-border)",
          }}
        >
          <Circle size={12} /> Point
        </button>
        <button
          onClick={() => setMode("box")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs mono uppercase tracking-widest cursor-pointer transition-all"
          style={{
            background: mode === "box" ? "var(--accent-soft)" : "transparent",
            color: mode === "box" ? "var(--accent)" : "var(--text-faint)",
            border: "1px solid var(--panel-border)",
          }}
        >
          <Square size={12} /> Bounding box
        </button>
      </div>

      {/* Coordinate inputs */}
      {mode === "point" ? (
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-faint)" }}>
              <MapPin size={10} className="inline mr-1" /> Latitude
            </label>
            <input type="number" step="0.1" value={lat} onChange={e => setLat(parseFloat(e.target.value))}
              className={inputCls} style={{ borderColor: "var(--panel-border)" }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-faint)" }}>
              <MapPin size={10} className="inline mr-1" /> Longitude
            </label>
            <input type="number" step="0.1" value={lon} onChange={e => setLon(parseFloat(e.target.value))}
              className={inputCls} style={{ borderColor: "var(--panel-border)" }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-faint)" }}>
              <CalendarRange size={10} className="inline mr-1" /> Start year
            </label>
            <input type="number" value={start} onChange={e => setStart(parseInt(e.target.value))}
              className={inputCls} style={{ borderColor: "var(--panel-border)" }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-faint)" }}>
              <CalendarRange size={10} className="inline mr-1" /> End year
            </label>
            <input type="number" value={end} onChange={e => setEnd(parseInt(e.target.value))}
              className={inputCls} style={{ borderColor: "var(--panel-border)" }} />
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls} style={{ color: "var(--text-faint)" }}>Min lat</label>
            <input type="number" step="0.1" value={minLat} onChange={e => setMinLat(parseFloat(e.target.value))}
              className={inputCls} style={{ borderColor: "var(--panel-border)" }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-faint)" }}>Max lat</label>
            <input type="number" step="0.1" value={maxLat} onChange={e => setMaxLat(parseFloat(e.target.value))}
              className={inputCls} style={{ borderColor: "var(--panel-border)" }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-faint)" }}>Min lon</label>
            <input type="number" step="0.1" value={minLon} onChange={e => setMinLon(parseFloat(e.target.value))}
              className={inputCls} style={{ borderColor: "var(--panel-border)" }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-faint)" }}>Max lon</label>
            <input type="number" step="0.1" value={maxLon} onChange={e => setMaxLon(parseFloat(e.target.value))}
              className={inputCls} style={{ borderColor: "var(--panel-border)" }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-faint)" }}>Start year</label>
            <input type="number" value={start} onChange={e => setStart(parseInt(e.target.value))}
              className={inputCls} style={{ borderColor: "var(--panel-border)" }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "var(--text-faint)" }}>End year</label>
            <input type="number" value={end} onChange={e => setEnd(parseInt(e.target.value))}
              className={inputCls} style={{ borderColor: "var(--panel-border)" }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t" style={{ borderColor: "var(--panel-border)" }}>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          Hazard: <span className="mono" style={{ color: "var(--accent)" }}>heatwave</span> ·
          Threshold: 95<sup>th</sup> percentile · Min duration 3 days
          {mode === "box" && <> · Grid: 3×3</>}
        </p>
        <Button disabled={loading} className="flex items-center gap-2" onClick={handleRun}>
          <Play size={14} /> {loading ? "Scanning…" : "Run analysis"}
        </Button>
      </div>
    </Card>
  );
}