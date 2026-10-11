import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Rectangle, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default marker icons broken by Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({ mode, onPick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (mode === "point") {
        onPick({ lat: +lat.toFixed(4), lon: +lng.toFixed(4) });
      } else {
        onPick({
          minLat: +(lat - 0.2).toFixed(4),
          maxLat: +(lat + 0.2).toFixed(4),
          minLon: +(lng - 0.2).toFixed(4),
          maxLon: +(lng + 0.2).toFixed(4),
        });
      }
    },
  });
  return null;
}

function Recenter({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
}

export default function MapPicker({ mode, center, box, onPick }) {
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div
      style={{
        height: 320,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--panel-border)",
      }}
    >
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <Recenter lat={center[0]} lon={center[1]} />
        <ClickHandler mode={mode} onPick={onPick} />

        {mode === "point" && <Marker position={center} />}

        {mode === "box" && box && (
          <Rectangle
            bounds={[
              [box.minLat, box.minLon],
              [box.maxLat, box.maxLon],
            ]}
            pathOptions={{ color: "#f97316", weight: 2, fillOpacity: 0.15 }}
          />
        )}
      </MapContainer>
    </div>
  );
}