import React, { useMemo } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import dateFormat from "dateformat";

import { TideStationWithPrediction } from "../types";
import "./station-icon.css";

const SIZE = 28;
const FILL_COLOR = "#2166ac";
const EMPTY_COLOR = "#d1e5f0";

function getIconHtml(fillPercent: number, stationId: string) {
  // SVG circle where water level fills from bottom
  const r = SIZE / 2;
  // clipPath y position: 0% fill = fully clipped (top), 100% = no clip (full)
  const clipY = SIZE * (1 - fillPercent);
  const clipId = `tide-fill-${stationId}`;
  return `
    <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      <defs>
        <clipPath id="${clipId}">
          <rect x="0" y="${clipY}" width="${SIZE}" height="${SIZE}" />
        </clipPath>
      </defs>
      <circle cx="${r}" cy="${r}" r="${r - 1}" fill="${EMPTY_COLOR}" stroke="white" stroke-width="2" />
      <circle cx="${r}" cy="${r}" r="${r - 1}" fill="${FILL_COLOR}" clip-path="url(#${clipId})" />
      <circle cx="${r}" cy="${r}" r="${r - 1}" fill="none" stroke="white" stroke-width="2" />
    </svg>
  `;
}

function buildChartSvg(
  predictions: TideStationWithPrediction["predictions"],
  currentIndex: number
) {
  const w = 260;
  const h = 80;
  const pad = { top: 4, bottom: 14, left: 28, right: 4 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const levels = predictions.map((p) => p.waterLevel);
  const min = Math.min(...levels);
  const max = Math.max(...levels);
  const range = max - min || 1;

  // Build polyline points
  const points = levels
    .map((level, i) => {
      const x = pad.left + (i / (levels.length - 1)) * chartW;
      const y = pad.top + chartH - ((level - min) / range) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // Current position marker
  const cx = pad.left + (currentIndex / (levels.length - 1)) * chartW;
  const cy =
    pad.top + chartH - ((levels[currentIndex] - min) / range) * chartH;

  // Y-axis ticks
  const nTicks = 3;
  const ticks = Array.from({ length: nTicks }, (_, i) => {
    const val = min + (i / (nTicks - 1)) * range;
    const y = pad.top + chartH - (i / (nTicks - 1)) * chartH;
    return `<text x="${pad.left - 3}" y="${y + 3}" text-anchor="end" font-size="8" fill="#666">${val.toFixed(1)}</text>`;
  }).join("");

  // X-axis: show a few date labels
  const nXLabels = 3;
  const xLabels = Array.from({ length: nXLabels }, (_, i) => {
    const idx = Math.round((i / (nXLabels - 1)) * (predictions.length - 1));
    const x = pad.left + (idx / (predictions.length - 1)) * chartW;
    const d = new Date(predictions[idx].Time);
    const label = dateFormat(d, "mmm d");
    return `<text x="${x}" y="${h - 1}" text-anchor="middle" font-size="8" fill="#666">${label}</text>`;
  }).join("");

  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="white" rx="4"/>
    <polyline points="${points}" fill="none" stroke="${FILL_COLOR}" stroke-width="1.5" />
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3.5" fill="#e04040" stroke="white" stroke-width="1"/>
    ${ticks}
    ${xLabels}
  </svg>`;
}

const TideMarker: React.FC<TideStationWithPrediction & { index: number }> = ({
  name,
  id,
  lat,
  lng,
  predictions,
  index,
}) => {
  const clampedIndex = Math.min(index, predictions.length - 1);
  const prediction = predictions[clampedIndex];
  if (!prediction) return null;

  const { min, max } = useMemo(() => {
    let min = Infinity,
      max = -Infinity;
    for (const p of predictions) {
      if (p.waterLevel < min) min = p.waterLevel;
      if (p.waterLevel > max) max = p.waterLevel;
    }
    return { min, max };
  }, [predictions]);

  const range = max - min || 1;
  const fillPercent = (prediction.waterLevel - min) / range;

  const level = prediction.waterLevel;
  const date = new Date(prediction.Time);
  const stationCode = id.replace("chs-tide-", "");

  const chartSvg = useMemo(
    () => buildChartSvg(predictions, clampedIndex),
    [predictions, clampedIndex]
  );

  return (
    <Marker
      position={[lat, lng]}
      icon={L.divIcon({
        iconSize: [SIZE, SIZE],
        iconAnchor: [SIZE / 2, SIZE / 2],
        html: getIconHtml(fillPercent, id),
        className: "",
      })}
    >
      <Popup minWidth={270}>
        <div>
          <a
            href={`https://www.tides.gc.ca/en/stations/${stationCode}`}
            rel="noreferrer"
            target="_blank"
            style={{ fontWeight: "bold" }}
          >
            {name}
          </a>
          <p style={{ margin: "4px 0" }}>
            {level.toFixed(2)}m at {dateFormat(date, "ddd, mmm dS, h:MM TT")}
          </p>
          <div dangerouslySetInnerHTML={{ __html: chartSvg }} />
        </div>
      </Popup>
    </Marker>
  );
};

export default TideMarker;
