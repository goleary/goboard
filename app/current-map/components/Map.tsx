import React, { PropsWithChildren } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <MapContainer center={[48, -123]} zoom={8} style={{ height: "100%" }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution={`&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
      &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`}
      />
      {children}
    </MapContainer>
  );
};
export default Map;
