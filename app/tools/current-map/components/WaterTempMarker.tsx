import React from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

import { WaterTempStation } from "../types";

const SIZE = 24;

const TEMP_COLORS = [
  { max: 45, color: "#3b82f6" },
  { max: 50, color: "#0ea5e9" },
  { max: 55, color: "#06b6d4" },
  { max: 60, color: "#14b8a6" },
  { max: 65, color: "#22c55e" },
  { max: 70, color: "#eab308" },
  { max: Infinity, color: "#f97316" },
];

export function getTempColor(tempF: number): string {
  for (const { max, color } of TEMP_COLORS) {
    if (tempF < max) return color;
  }
  return TEMP_COLORS[TEMP_COLORS.length - 1].color;
}

function getIconHtml(tempF: number) {
  const color = getTempColor(tempF);
  const r = SIZE / 2;
  const displayTemp = Math.round(tempF);
  return `
    <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      <circle cx="${r}" cy="${r}" r="${r - 1}" fill="${color}" stroke="white" stroke-width="2" opacity="0.9"/>
      <text x="${r}" y="${r + 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="white">${displayTemp}</text>
    </svg>
  `;
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const WaterTempMarker: React.FC<WaterTempStation> = ({
  name,
  lat,
  lng,
  source,
  waterTempF,
  measuredAt,
  sourceUrl,
}) => {
  return (
    <Marker
      position={[lat, lng]}
      icon={L.divIcon({
        iconSize: [SIZE, SIZE],
        iconAnchor: [SIZE / 2, SIZE / 2],
        html: getIconHtml(waterTempF),
        className: "",
      })}
    >
      <Popup>
        <div>
          <a
            href={sourceUrl}
            rel="noreferrer"
            target="_blank"
            style={{ fontWeight: "bold" }}
          >
            {name}
          </a>
          <p style={{ margin: "4px 0" }}>
            {waterTempF.toFixed(1)}&deg;F &middot;{" "}
            {source === "noaa-temp" ? "NOAA" : "ECCC"}
          </p>
          <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>
            Measured {formatRelativeTime(measuredAt)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

export default WaterTempMarker;
