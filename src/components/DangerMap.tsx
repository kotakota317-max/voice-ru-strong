import { useEffect } from "react";
import { MapContainer, TileLayer, Circle, Marker, useMap } from "react-leaflet";
import L from "leaflet";

export type DangerZone = {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  level: "safe" | "caution" | "danger" | "critical";
  reports: number;
};

const LEVEL_COLOR: Record<DangerZone["level"], string> = {
  safe: "#22c55e",
  caution: "#eab308",
  danger: "#f97316",
  critical: "#ef4444",
};

const dotIcon = L.divIcon({
  className: "",
  html: '<div style="width:10px;height:10px;background:#ef4444;border:2px solid white;border-radius:9999px;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
  iconSize: [10, 10],
});

function Invalidate() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

export function DangerMap({
  zones,
  incidents,
  onZoneClick,
  center = [35.6812, 139.7671],
  zoom = 12,
}: {
  zones: DangerZone[];
  incidents: { id: string; pos: [number, number] }[];
  onZoneClick?: (z: DangerZone) => void;
  center?: [number, number];
  zoom?: number;
}) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <Invalidate />
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {zones.map((z) => (
        <Circle
          key={z.id}
          center={z.center}
          radius={z.radius}
          pathOptions={{
            color: LEVEL_COLOR[z.level],
            fillColor: LEVEL_COLOR[z.level],
            fillOpacity: 0.35,
            weight: 1,
          }}
          eventHandlers={{ click: () => onZoneClick?.(z) }}
        />
      ))}
      {incidents.map((i) => (
        <Marker key={i.id} position={i.pos} icon={dotIcon} />
      ))}
    </MapContainer>
  );
}