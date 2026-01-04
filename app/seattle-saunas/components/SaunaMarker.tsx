import React from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import Link from "next/link";
import { type Sauna } from "@/data/saunas/seattle-saunas";

interface SaunaMarkerProps {
  sauna: Sauna;
}

const getMarkerIcon = () => {
  return L.divIcon({
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: "sauna-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: hsl(240 5.9% 10%);
        border: 2px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg 
          style="transform: rotate(45deg); width: 14px; height: 14px;" 
          fill="white" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>
    `,
  });
};

export function SaunaMarker({ sauna }: SaunaMarkerProps) {
  return (
    <Marker position={[sauna.lat, sauna.lng]} icon={getMarkerIcon()}>
      <Popup>
        <div className="min-w-[160px]">
          <h3 className="font-semibold text-base mb-1">{sauna.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {sauna.neighborhood} · {sauna.priceRange}
          </p>
          <Link
            href={`/seattle-saunas/${sauna.slug}`}
            className="text-sm text-primary hover:underline font-medium"
          >
            View Details →
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

export default SaunaMarker;

