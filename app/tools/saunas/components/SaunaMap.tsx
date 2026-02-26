"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import type { LatLngBounds, PointTuple } from "leaflet";
import { type Sauna } from "@/data/saunas/saunas";
import { SaunaMarker } from "./SaunaMarker";
import { createClusterIcon } from "./createClusterIcon";

const MarkerClusterGroup = dynamic(
  () => import("react-leaflet-cluster").then((mod) => mod.default),
  { ssr: false }
);

export type { LatLngBounds };

// Component to track map bounds and zoom level, reporting changes
function BoundsTracker({
  onBoundsChange,
  onZoomChange,
}: {
  onBoundsChange?: (bounds: LatLngBounds) => void;
  onZoomChange?: (zoom: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!onBoundsChange && !onZoomChange) return;

    const reportBounds = () => {
      // Only report if the map container is visible and has a valid size
      const container = map.getContainer();
      if (
        !container ||
        container.offsetWidth === 0 ||
        container.offsetHeight === 0
      ) {
        return;
      }

      const bounds = map.getBounds();
      // Only report if bounds are valid (non-zero area)
      if (bounds.isValid()) {
        onBoundsChange?.(bounds);
      }
      onZoomChange?.(map.getZoom());
    };

    // Listen for move/zoom events
    map.on("moveend", reportBounds);
    map.on("zoomend", reportBounds);

    // Report initial bounds when map is ready
    map.whenReady(() => {
      // Small delay to ensure container is sized
      setTimeout(reportBounds, 50);
    });

    return () => {
      map.off("moveend", reportBounds);
      map.off("zoomend", reportBounds);
    };
  }, [map, onBoundsChange, onZoomChange]);

  return null;
}

// Component to handle map panning/zooming when a sauna is selected
function MapPanner({
  selectedSauna,
  isMobile,
  panToSelection,
}: {
  selectedSauna: Sauna | null;
  isMobile: boolean;
  panToSelection: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedSauna || !panToSelection) return;

    const mapSize = map.getSize();
    const targetZoom = 14;

    // Calculate where we want the marker to appear on screen
    let targetX: number;
    let targetY: number;

    if (isMobile) {
      // On mobile, position marker in the top fifth of the map
      targetX = mapSize.x / 2;
      targetY = mapSize.y / 10;
    } else {
      // On desktop, position marker in center of visible area (right of panel)
      const leftPanelWidth = 340;
      targetX = leftPanelWidth + (mapSize.x - leftPanelWidth) / 2;
      targetY = mapSize.y / 2;
    }

    // Calculate pixel offset from screen center to target position
    const centerX = mapSize.x / 2;
    const centerY = mapSize.y / 2;
    const offsetX = centerX - targetX;
    const offsetY = centerY - targetY;

    // Project sauna to pixel coordinates at target zoom level
    const saunaPoint = map.project(
      [selectedSauna.lat, selectedSauna.lng],
      targetZoom
    );

    // Convert back to lat/lng and set view in a single smooth animation
    const adjustedCenter = map.unproject(
      // Calculate the map center that will position the sauna at our target screen location

      [saunaPoint.x + offsetX, saunaPoint.y + offsetY],
      targetZoom
    );
    map.setView(adjustedCenter, targetZoom, { animate: true });
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

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
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
  onZoomChange?: (zoom: number) => void;
  selectedSlug?: string | null;
  selectedSauna?: Sauna | null;
  isMobile?: boolean;
  /** When true, zoom/pan to the selected sauna (use for list selections, not marker clicks) */
  panToSelection?: boolean;
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
  onZoomChange,
  selectedSlug,
  selectedSauna,
  isMobile = false,
  panToSelection = false,
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
        <BoundsTracker onBoundsChange={onBoundsChange} onZoomChange={onZoomChange} />
        <MapPanner
          selectedSauna={selectedSauna || null}
          isMobile={isMobile}
          panToSelection={panToSelection}
        />
        <MapClickHandler onMapClick={onMapClick} />
        <MarkerClusterGroup
          iconCreateFunction={createClusterIcon}
          maxClusterRadius={50}
          zoomToBoundsOnClick={true}
          spiderfyOnMaxZoom={true}
          animate={false}
          removeOutsideVisibleBounds={false}
          showCoverageOnHover={false}
        >
          {saunas.map((sauna) => (
            <SaunaMarker
              key={sauna.slug}
              sauna={sauna}
              onClick={onSaunaClick}
              isSelected={sauna.slug === selectedSlug}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

export default SaunaMap;
