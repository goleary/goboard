import L from "leaflet";
import "leaflet.markercluster";

export function createClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  const count = cluster.getChildCount();

  // Dynamic sizing based on count
  let size = 44;
  if (count >= 100) {
    size = 56;
  } else if (count >= 10) {
    size = 50;
  }

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: white;
        border: 2px solid #0ea5e9;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        cursor: pointer;
      ">
        <span style="font-size: ${size * 0.4}px; line-height: 1;">🔥</span>
        <span style="font-size: ${size * 0.3}px; font-weight: 600; color: #0ea5e9; line-height: 1;">${count}</span>
      </div>
    `,
    className: "sauna-cluster-icon",
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2),
  });
}
