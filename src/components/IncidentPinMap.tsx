import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { TYPE_COLOR, type IncidentType } from "@/lib/incident-types";
export { TYPE_COLOR, type IncidentType };

export type IncidentPin = {
  id: string;
  type: IncidentType;
  pos: [number, number];
};

function pinIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:22px;height:22px;background:${color};border:3px solid white;border-radius:9999px;box-shadow:0 4px 10px rgba(0,0,0,.35)"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function Invalidate() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

export function IncidentPinMap({
  pins,
  onPinClick,
}: {
  pins: IncidentPin[];
  onPinClick?: (p: IncidentPin) => void;
}) {
  return (
    <MapContainer center={[35.6812, 139.7671]} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <Invalidate />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap" />
      {pins.map((p) => (
        <Marker
          key={p.id}
          position={p.pos}
          icon={pinIcon(TYPE_COLOR[p.type])}
          eventHandlers={{ click: () => onPinClick?.(p) }}
        />
      ))}
    </MapContainer>
  );
}