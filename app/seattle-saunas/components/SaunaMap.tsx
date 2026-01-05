"use client";

import React from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { type Sauna } from "@/data/saunas/seattle-saunas";
import { SaunaMarker } from "./SaunaMarker";

interface SaunaMapProps {
  saunas: Sauna[];
  className?: string;
  center?: [number, number];
  zoom?: number;
  onSaunaClick?: (sauna: Sauna) => void;
}

// Seattle center coordinates
const SEATTLE_CENTER: [number, number] = [47.6062, -122.3321];

export function SaunaMap({
  saunas,
  className,
  center = SEATTLE_CENTER,
  zoom = 12,
  onSaunaClick,
}: SaunaMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      className={className}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>'
      />
      <ZoomControl position="bottomright" />
      {saunas.map((sauna) => (
        <SaunaMarker key={sauna.slug} sauna={sauna} onClick={onSaunaClick} />
      ))}
    </MapContainer>
  );
}

export default SaunaMap;

