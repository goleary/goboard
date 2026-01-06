"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngBounds } from "leaflet";
import { type Sauna } from "@/data/saunas/seattle-saunas";
import { SaunaMarker } from "./SaunaMarker";

export type { LatLngBounds };

// Component to track map bounds and report changes
function BoundsTracker({ onBoundsChange }: { onBoundsChange?: (bounds: LatLngBounds) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onBoundsChange) return;

    const reportBounds = () => {
      // Only report if the map container is visible and has a valid size
      const container = map.getContainer();
      if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
        return;
      }
      
      const bounds = map.getBounds();
      // Only report if bounds are valid (non-zero area)
      if (bounds.isValid()) {
        onBoundsChange(bounds);
      }
    };

    // Listen for move/zoom events
    map.on('moveend', reportBounds);
    map.on('zoomend', reportBounds);
    
    // Report initial bounds when map is ready
    map.whenReady(() => {
      // Small delay to ensure container is sized
      setTimeout(reportBounds, 50);
    });

    return () => {
      map.off('moveend', reportBounds);
      map.off('zoomend', reportBounds);
    };
  }, [map, onBoundsChange]);

  return null;
}

// Component to handle map panning when a sauna is selected
function MapPanner({ selectedSauna, isMobile }: { selectedSauna: Sauna | null; isMobile: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedSauna) return;

    const point = map.latLngToContainerPoint([selectedSauna.lat, selectedSauna.lng]);
    const mapSize = map.getSize();
    
    if (isMobile) {
      // On mobile, always pan to center the marker in the top fifth of the map
      // Target: horizontally centered, vertically at 1/10 of map height (center of top fifth)
      const targetX = mapSize.x / 2;
      const targetY = mapSize.y / 10;
      const offsetX = point.x - targetX;
      const offsetY = point.y - targetY;
      
      // Only pan if the offset is significant (more than 20px)
      if (Math.abs(offsetX) > 20 || Math.abs(offsetY) > 20) {
        map.panBy([offsetX, offsetY], { animate: true, duration: 0.3 });
      }
    } else {
      // On desktop, check if marker is visible (accounting for left panel ~340px)
      const leftPanelWidth = 340;
      const isVisible = point.y >= 0 && point.y <= mapSize.y && 
                        point.x >= leftPanelWidth && point.x <= mapSize.x;
      
      if (!isVisible) {
        // Pan to center marker in visible map area (right of panel)
        const targetX = leftPanelWidth + (mapSize.x - leftPanelWidth) / 2;
        const targetY = mapSize.y / 2;
        const offsetX = point.x - targetX;
        const offsetY = point.y - targetY;
        map.panBy([offsetX, offsetY], { animate: true, duration: 0.3 });
      }
    }
  }, [selectedSauna, map, isMobile]);

  return null;
}

// Component to handle map clicks (for deselecting)
function MapClickHandler({ onMapClick }: { onMapClick?: () => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onMapClick) return;

    const handleClick = () => {
      onMapClick();
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

// CSS to move zoom controls to top-right on mobile
const mobileZoomStyles = `
  @media (max-width: 1023px) {
    .leaflet-bottom.leaflet-right {
      bottom: auto !important;
      top: 10px !important;
    }
    .leaflet-bottom.leaflet-right .leaflet-control {
      margin-bottom: 0 !important;
      margin-top: 0 !important;
    }
    /* Hide attribution on mobile to avoid overlap */
    .leaflet-bottom.leaflet-right .leaflet-control-attribution {
      display: none;
    }
  }
`;

interface SaunaMapProps {
  saunas: Sauna[];
  className?: string;
  center?: [number, number];
  zoom?: number;
  onSaunaClick?: (sauna: Sauna) => void;
  onMapClick?: () => void;
  onBoundsChange?: (bounds: LatLngBounds) => void;
  selectedSlug?: string | null;
  selectedSauna?: Sauna | null;
  isMobile?: boolean;
}

// Seattle center coordinates
const SEATTLE_CENTER: [number, number] = [47.6062, -122.3321];

export function SaunaMap({
  saunas,
  className,
  center = SEATTLE_CENTER,
  zoom = 12,
  onSaunaClick,
  onMapClick,
  onBoundsChange,
  selectedSlug,
  selectedSauna,
  isMobile = false,
}: SaunaMapProps) {
  return (
    <>
      <style>{mobileZoomStyles}</style>
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
        <BoundsTracker onBoundsChange={onBoundsChange} />
        <MapPanner selectedSauna={selectedSauna || null} isMobile={isMobile} />
        <MapClickHandler onMapClick={onMapClick} />
        {saunas.map((sauna) => (
          <SaunaMarker 
            key={sauna.slug} 
            sauna={sauna} 
            onClick={onSaunaClick}
            isSelected={sauna.slug === selectedSlug}
          />
        ))}
      </MapContainer>
    </>
  );
}

export default SaunaMap;

