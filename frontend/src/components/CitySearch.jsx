import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function CitySearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const { latitude, longitude, name, country } = data.results[0];
        onSelect({ lat: latitude, lon: longitude, label: `${name}, ${country}` });
      } else {
        alert("City not found. Try a different name.");
      }
    } catch {
      alert("Failed to fetch city. Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search city (e.g., Mumbai, London)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && search()}
        className="bg-transparent border-b py-1 outline-none text-sm w-full"
        style={{ borderColor: "var(--panel-border)", color: "var(--text)" }}
      />
      <button
        onClick={search}
        disabled={loading}
        className="p-2 rounded-lg cursor-pointer"
        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
      </button>
    </div>
  );
}