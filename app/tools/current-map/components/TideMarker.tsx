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
  const w = 320;
  const h = 140;
  const pad = { top: 12, bottom: 28, left: 34, right: 8 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const levels = predictions.map((p) => p.waterLevel);
  const min = Math.min(...levels);
  const max = Math.max(...levels);
  const range = max - min || 1;

  // Add some padding to the y range
  const yMin = min - range * 0.05;
  const yMax = max + range * 0.05;
  const yRange = yMax - yMin;

  const toX = (i: number) => pad.left + (i / (levels.length - 1)) * chartW;
  const toY = (level: number) =>
    pad.top + chartH - ((level - yMin) / yRange) * chartH;

  // Build filled area + line
  const linePoints = levels
    .map((level, i) => `${toX(i).toFixed(1)},${toY(level).toFixed(1)}`)
    .join(" ");

  const areaPoints = [
    `${toX(0).toFixed(1)},${(pad.top + chartH).toFixed(1)}`,
    ...levels.map(
      (level, i) => `${toX(i).toFixed(1)},${toY(level).toFixed(1)}`
    ),
    `${toX(levels.length - 1).toFixed(1)},${(pad.top + chartH).toFixed(1)}`,
  ].join(" ");

  // Current position marker
  const cx = toX(currentIndex);
  const cy = toY(levels[currentIndex]);

  // Vertical line at current time
  const nowLine = `<line x1="${cx.toFixed(1)}" y1="${pad.top}" x2="${cx.toFixed(1)}" y2="${pad.top + chartH}" stroke="#e04040" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>`;

  // Y-axis ticks and grid lines
  const nTicks = 4;
  const ticks = Array.from({ length: nTicks }, (_, i) => {
    const val = min + (i / (nTicks - 1)) * range;
    const y = toY(val);
    return [
      `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${pad.left + chartW}" y2="${y.toFixed(1)}" stroke="#e0e0e0" stroke-width="0.5"/>`,
      `<text x="${pad.left - 4}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="9" fill="#888">${val.toFixed(1)}</text>`,
    ].join("");
  }).join("");

  // Find local highs and lows for annotations
  const annotations: string[] = [];
  for (let i = 1; i < levels.length - 1; i++) {
    const prev = levels[i - 1];
    const curr = levels[i];
    const next = levels[i + 1];
    const isHigh = curr > prev && curr > next;
    const isLow = curr < prev && curr < next;
    if (isHigh || isLow) {
      const x = toX(i);
      const y = toY(curr);
      const labelY = isHigh ? y - 6 : y + 11;
      annotations.push(
        `<text x="${x.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="8" fill="#555" font-weight="500">${curr.toFixed(1)}m</text>`
      );
    }
  }

  // X-axis: show time labels at midnight and noon boundaries
  const xLabels: string[] = [];
  const seenLabels = new Set<string>();
  for (let i = 0; i < predictions.length; i++) {
    const d = new Date(predictions[i].Time);
    const hour = d.getHours();
    if (hour === 0 || hour === 6 || hour === 12 || hour === 18) {
      const key = `${d.getDate()}-${hour}`;
      if (seenLabels.has(key)) continue;
      seenLabels.add(key);
      const x = toX(i);
      if (x < pad.left + 10 || x > pad.left + chartW - 10) continue;
      const label =
        hour === 0
          ? dateFormat(d, "mmm d")
          : dateFormat(d, "HH:MM");
      // Tick mark
      xLabels.push(
        `<line x1="${x.toFixed(1)}" y1="${pad.top + chartH}" x2="${x.toFixed(1)}" y2="${pad.top + chartH + 4}" stroke="#aaa" stroke-width="0.5"/>`
      );
      // Lighter vertical grid at midnight
      if (hour === 0) {
        xLabels.push(
          `<line x1="${x.toFixed(1)}" y1="${pad.top}" x2="${x.toFixed(1)}" y2="${pad.top + chartH}" stroke="#ddd" stroke-width="0.5"/>`
        );
      }
      xLabels.push(
        `<text x="${x.toFixed(1)}" y="${h - 6}" text-anchor="middle" font-size="8" fill="#888">${label}</text>`
      );
    }
  }

  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="white" rx="4"/>
    <rect x="${pad.left}" y="${pad.top}" width="${chartW}" height="${chartH}" fill="#f8fbff" rx="2"/>
    ${ticks}
    <polygon points="${areaPoints}" fill="${FILL_COLOR}" opacity="0.1"/>
    <polyline points="${linePoints}" fill="none" stroke="${FILL_COLOR}" stroke-width="1.5" stroke-linejoin="round"/>
    ${annotations.join("")}
    ${nowLine}
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4" fill="#e04040" stroke="white" stroke-width="1.5"/>
    ${xLabels.join("")}
    <text x="${pad.left}" y="${h - 6}" text-anchor="start" font-size="8" fill="#aaa">m</text>
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
      <Popup minWidth={330}>
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
