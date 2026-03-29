import React, { PropsWithChildren, useEffect, useRef } from "react";
import L from "leaflet";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [48, -123];
const DEFAULT_ZOOM = 8;

export type Bounds = {
  south: number;
  north: number;
  west: number;
  east: number;
};

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

function ContextMenu() {
  const map = useMap();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const handler = (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();
      const { lat, lng } = e.latlng;
      const text = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      L.popup()
        .setLatLng(e.latlng)
        .setContent(
          `<div style="font-family:monospace;cursor:pointer" onclick="navigator.clipboard.writeText('${text}')">${text}<br><small>click to copy</small></div>`
        )
        .openOn(map);
    };

    map.on("contextmenu", handler);
    return () => { map.off("contextmenu", handler); };
  }, [map]);

  return null;
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
}>;

const Map: React.FC<MapProps> = ({ children, onBoundsChange }) => {
  const { center, zoom } = getInitialParams();
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%" }}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="CARTO Voyager">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="ESRI Ocean">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
            maxZoom={13}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="ESRI Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Sea Marks">
          <TileLayer
            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
            attribution='Map data: &copy; <a href="http://www.openseamap.org" target="_blank">OpenSeaMap</a> contributors'
          />
        </LayersControl.Overlay>
      </LayersControl>
      <MapSync onBoundsChange={onBoundsChange} />
      <ContextMenu />
      {children}
    </MapContainer>
  );
};
export default Map;
