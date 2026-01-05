import React from "react";
import L from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import { type Sauna } from "@/data/saunas/seattle-saunas";

interface SaunaMarkerProps {
  sauna: Sauna;
  onClick?: (sauna: Sauna) => void;
}

const getMarkerIcon = () => {
  return L.divIcon({
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
    className: "sauna-marker",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: white;
        border: 2px solid #0ea5e9;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
      ">♨️</div>
    `,
  });
};

export function SaunaMarker({ sauna, onClick }: SaunaMarkerProps) {
  return (
    <Marker 
      position={[sauna.lat, sauna.lng]} 
      icon={getMarkerIcon()}
      eventHandlers={{
        click: () => onClick?.(sauna),
      }}
    >
      <Tooltip direction="top" offset={[0, -28]}>
        <span className="font-medium">{sauna.name}</span>
        {sauna.sessionPrice > 0 && (
          <span className="text-muted-foreground"> · ${sauna.sessionPrice}</span>
        )}
      </Tooltip>
    </Marker>
  );
}

export default SaunaMarker;

