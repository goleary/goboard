import { useMemo } from "react";
import L from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import { type Sauna, formatPrice } from "@/data/saunas/saunas";
import { getMarkerPinHtml } from "./markerHtml";

interface SaunaMarkerProps {
  sauna: Sauna;
  onClick?: (sauna: Sauna) => void;
  isSelected?: boolean;
}

const getMarkerIcon = (
  isSelected: boolean,
  waterfront: boolean,
  coldPlunge: boolean,
  naturalPlunge: boolean,
  soakingTub: boolean,
  floating: boolean,
  markerIconOverride?: Sauna["markerIconOverride"],
) => {
  const pinWidth = 36;
  const pinHeight = 46;
  const pinTipY = Math.round(pinHeight * (42 / 52));

  return L.divIcon({
    iconSize: [pinWidth, pinHeight],
    iconAnchor: [pinWidth / 2, pinTipY],
    popupAnchor: [0, -pinTipY + 6],
    className: "sauna-marker",
    html: getMarkerPinHtml({
      isSelected,
      waterfront,
      coldPlunge,
      naturalPlunge,
      soakingTub,
      floating,
      markerIconOverride,
    }),
  });
};

export function SaunaMarker({
  sauna,
  onClick,
  isSelected = false,
}: SaunaMarkerProps) {
  const icon = useMemo(
    () =>
      getMarkerIcon(
        isSelected,
        sauna.waterfront,
        sauna.coldPlunge,
        sauna.naturalPlunge,
        sauna.soakingTub,
        sauna.floating ?? false,
        sauna.markerIconOverride,
      ),
    [
      isSelected,
      sauna.waterfront,
      sauna.coldPlunge,
      sauna.naturalPlunge,
      sauna.soakingTub,
      sauna.floating,
      sauna.markerIconOverride,
    ],
  );

  return (
    <Marker
      position={[sauna.lat, sauna.lng]}
      icon={icon}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{
        click: () => onClick?.(sauna),
      }}
    >
      <Tooltip direction="top" offset={[0, -33]}>
        <span className="font-medium">{sauna.name}</span>
        {sauna.sessionPrice > 0 && (
          <span className="text-muted-foreground">
            {" "}
            · {formatPrice(sauna)}
          </span>
        )}
      </Tooltip>
    </Marker>
  );
}

export default SaunaMarker;
