import React, { useMemo } from "react";
import L from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import { type Sauna } from "@/data/saunas/seattle-saunas";

interface SaunaMarkerProps {
  sauna: Sauna;
  onClick?: (sauna: Sauna) => void;
  isSelected?: boolean;
}

const getMarkerIcon = (isSelected: boolean) => {
  const size = isSelected ? 44 : 36;
  const fontSize = isSelected ? 24 : 20;
  const borderColor = isSelected ? "#f97316" : "#0ea5e9"; // orange when selected, sky blue otherwise
  const borderWidth = isSelected ? 3 : 2;
  const shadow = isSelected 
    ? "0 4px 12px rgba(249, 115, 22, 0.5)" 
    : "0 2px 6px rgba(0,0,0,0.25)";
  
  return L.divIcon({
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    className: "sauna-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: white;
        border: ${borderWidth}px solid ${borderColor};
        border-radius: 50%;
        box-shadow: ${shadow};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: ${fontSize}px;
        transition: all 0.2s ease;
        ${isSelected ? "z-index: 1000;" : ""}
      ">🔥</div>
    `,
  });
};

export function SaunaMarker({ sauna, onClick, isSelected = false }: SaunaMarkerProps) {
  const icon = useMemo(() => getMarkerIcon(isSelected), [isSelected]);
  
  return (
    <Marker 
      position={[sauna.lat, sauna.lng]} 
      icon={icon}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{
        click: () => onClick?.(sauna),
      }}
    >
      <Tooltip direction="top" offset={[0, isSelected ? -32 : -28]}>
        <span className="font-medium">{sauna.name}</span>
        {sauna.sessionPrice > 0 && (
          <span className="text-muted-foreground"> · ${sauna.sessionPrice}</span>
        )}
      </Tooltip>
    </Marker>
  );
}

export default SaunaMarker;

