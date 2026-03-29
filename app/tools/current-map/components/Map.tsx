import React, { PropsWithChildren, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [48, -123];
const DEFAULT_ZOOM = 8;

export type Bounds = {
  south: number;
  north: number;
  west: number;
  east: number;
};

export const BASEMAPS = {
  voyager: {
    name: "CARTO Voyager",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>',
  },
  ocean: {
    name: "ESRI Ocean",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",
    maxNativeZoom: 13,
  },
  satellite: {
    name: "ESRI Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
} as const;

export type BasemapId = keyof typeof BASEMAPS;

export const SEA_MARKS_URL = "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png";

function getInitialParams(): { center: [number, number]; zoom: number } {
  if (typeof window === "undefined") {
    return { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
  }
  const params = new URLSearchParams(window.location.search);
  const lat = parseFloat(params.get("lat") || "");
  const lng = parseFloat(params.get("lng") || "");
  const zoom = parseInt(params.get("zoom") || "", 10);
  return {
    center:
      !isNaN(lat) && !isNaN(lng) ? [lat, lng] : DEFAULT_CENTER,
    zoom: !isNaN(zoom) ? zoom : DEFAULT_ZOOM,
  };
}

function MapSync({ onBoundsChange }: { onBoundsChange?: (bounds: Bounds) => void }) {
  const map = useMap();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Emit initial bounds once the map is ready
  useEffect(() => {
    emitBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMapEvents({
    moveend: () => update(),
    zoomend: () => update(),
  });

  function emitBounds() {
    if (!onBoundsChange) return;
    const b = map.getBounds();
    onBoundsChange({
      south: b.getSouth(),
      north: b.getNorth(),
      west: b.getWest(),
      east: b.getEast(),
    });
  }

  function update() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // Update URL
      const center = map.getCenter();
      const zoom = map.getZoom();
      const params = new URLSearchParams(window.location.search);
      params.set("lat", center.lat.toFixed(4));
      params.set("lng", center.lng.toFixed(4));
      params.set("zoom", zoom.toString());
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);

      // Emit bounds
      emitBounds();
    }, 300);
  }

  return null;
}

type MapProps = PropsWithChildren<{
  onBoundsChange?: (bounds: Bounds) => void;
  basemap?: BasemapId;
  showSeaMarks?: boolean;
}>;

const Map: React.FC<MapProps> = ({ children, onBoundsChange, basemap = "voyager", showSeaMarks = false }) => {
  const { center, zoom } = getInitialParams();
  const layer = BASEMAPS[basemap];
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%" }}>
      <TileLayer
        key={basemap}
        url={layer.url}
        attribution={layer.attribution}
        maxNativeZoom={"maxNativeZoom" in layer ? layer.maxNativeZoom : undefined}
      />
      {showSeaMarks && (
        <TileLayer
          url={SEA_MARKS_URL}
          attribution='Map data: &copy; <a href="http://www.openseamap.org" target="_blank">OpenSeaMap</a> contributors'
        />
      )}
      <MapSync onBoundsChange={onBoundsChange} />
      {children}
    </MapContainer>
  );
};
export default Map;
