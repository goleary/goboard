import React, { useMemo } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

import dateFormat from "dateformat";

import { CurrentPrediction, StationWithPrediction } from "../types";
import "./station-icon.css";
import { LEGEND_COLORS, VELOCITY_BREAK_POINTS } from "./Legend";

const FLOOD_COLOR = "#2166ac";
const EBB_COLOR = "#b2182b";

const getIconHtml = (rotation: number, fill = "black") => {
  return `
    <div style="transform: rotate(${rotation}deg);">
      <svg fill="${fill}" x="0px" y="0px" viewBox="0 0 490 490">
        <g>
          <path d="M480.086,490L245,339.229L9.914,490L245,0L480.086,490z"/>
        </g>
      </svg>
    </div>
  `;
};

function buildCurrentChartSvg(
  predictions: CurrentPrediction[],
  currentIndex: number
) {
  const w = 320;
  const h = 140;
  const pad = { top: 12, bottom: 28, left: 34, right: 8 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const velocities = predictions.map((p) => p.Velocity_Major);
  const absMax =
    Math.max(Math.max(...velocities), Math.abs(Math.min(...velocities))) || 1;
  // Symmetric y-axis around zero
  const yMax = absMax * 1.1;
  const yMin = -yMax;
  const yRange = yMax - yMin;

  const toX = (i: number) => pad.left + (i / (velocities.length - 1)) * chartW;
  const toY = (v: number) => pad.top + chartH - ((v - yMin) / yRange) * chartH;
  const zeroY = toY(0);

  // Build flood (positive) and ebb (negative) filled areas
  // We create separate polygons for segments above/below zero
  const floodParts: string[] = [];
  const ebbParts: string[] = [];

  for (let i = 0; i < velocities.length - 1; i++) {
    const x0 = toX(i);
    const x1 = toX(i + 1);
    const v0 = velocities[i];
    const v1 = velocities[i + 1];
    const y0 = toY(v0);
    const y1 = toY(v1);

    if (v0 >= 0 && v1 >= 0) {
      floodParts.push(
        `<polygon points="${x0.toFixed(1)},${zeroY.toFixed(1)} ${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${zeroY.toFixed(1)}" fill="${FLOOD_COLOR}" opacity="0.15"/>`
      );
    } else if (v0 <= 0 && v1 <= 0) {
      ebbParts.push(
        `<polygon points="${x0.toFixed(1)},${zeroY.toFixed(1)} ${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${zeroY.toFixed(1)}" fill="${EBB_COLOR}" opacity="0.15"/>`
      );
    } else {
      // Crossing zero — split at the crossing point
      const t = v0 / (v0 - v1);
      const xCross = x0 + t * (x1 - x0);
      if (v0 >= 0) {
        floodParts.push(
          `<polygon points="${x0.toFixed(1)},${zeroY.toFixed(1)} ${x0.toFixed(1)},${y0.toFixed(1)} ${xCross.toFixed(1)},${zeroY.toFixed(1)}" fill="${FLOOD_COLOR}" opacity="0.15"/>`
        );
        ebbParts.push(
          `<polygon points="${xCross.toFixed(1)},${zeroY.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${zeroY.toFixed(1)}" fill="${EBB_COLOR}" opacity="0.15"/>`
        );
      } else {
        ebbParts.push(
          `<polygon points="${x0.toFixed(1)},${zeroY.toFixed(1)} ${x0.toFixed(1)},${y0.toFixed(1)} ${xCross.toFixed(1)},${zeroY.toFixed(1)}" fill="${EBB_COLOR}" opacity="0.15"/>`
        );
        floodParts.push(
          `<polygon points="${xCross.toFixed(1)},${zeroY.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${zeroY.toFixed(1)}" fill="${FLOOD_COLOR}" opacity="0.15"/>`
        );
      }
    }
  }

  // Line path
  const linePoints = velocities
    .map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(" ");

  // Current position
  const cx = toX(currentIndex);
  const cy = toY(velocities[currentIndex]);
  const nowLine = `<line x1="${cx.toFixed(1)}" y1="${pad.top}" x2="${cx.toFixed(1)}" y2="${pad.top + chartH}" stroke="#e04040" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>`;

  // Zero line
  const zeroLine = `<line x1="${pad.left}" y1="${zeroY.toFixed(1)}" x2="${pad.left + chartW}" y2="${zeroY.toFixed(1)}" stroke="#999" stroke-width="0.75"/>`;

  // Y-axis ticks
  const tickValues = [
    -Math.round(absMax),
    0,
    Math.round(absMax),
  ];
  // Use nicer values if absMax is small
  const niceMax = Math.ceil(absMax);
  const yTicks = [-niceMax, 0, niceMax]
    .map((val) => {
      const y = toY(val);
      return [
        val !== 0
          ? `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${pad.left + chartW}" y2="${y.toFixed(1)}" stroke="#e0e0e0" stroke-width="0.5"/>`
          : "",
        `<text x="${pad.left - 4}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="9" fill="#888">${val}</text>`,
      ].join("");
    })
    .join("");

  // Flood/Ebb labels
  const floodLabel = `<text x="${pad.left + 2}" y="${(pad.top + 10).toFixed(1)}" font-size="8" fill="${FLOOD_COLOR}" opacity="0.7">Flood ↑</text>`;
  const ebbLabel = `<text x="${pad.left + 2}" y="${(pad.top + chartH - 3).toFixed(1)}" font-size="8" fill="${EBB_COLOR}" opacity="0.7">Ebb ↓</text>`;

  // X-axis time labels
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
        hour === 0 ? dateFormat(d, "mmm d") : dateFormat(d, "HH:MM");
      xLabels.push(
        `<line x1="${x.toFixed(1)}" y1="${pad.top + chartH}" x2="${x.toFixed(1)}" y2="${pad.top + chartH + 4}" stroke="#aaa" stroke-width="0.5"/>`
      );
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
    <rect x="${pad.left}" y="${pad.top}" width="${chartW}" height="${chartH}" fill="#fafafa" rx="2"/>
    ${yTicks}
    ${zeroLine}
    ${floodParts.join("")}
    ${ebbParts.join("")}
    <polyline points="${linePoints}" fill="none" stroke="#333" stroke-width="1.5" stroke-linejoin="round"/>
    ${floodLabel}
    ${ebbLabel}
    ${nowLine}
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4" fill="#e04040" stroke="white" stroke-width="1.5"/>
    ${xLabels.join("")}
    <text x="${pad.left}" y="${h - 6}" text-anchor="start" font-size="8" fill="#aaa">kn</text>
  </svg>`;
}

const StationMarker: React.FC<StationWithPrediction & { index: number }> = ({
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
  const rotation =
    prediction.Velocity_Major > 0
      ? prediction.meanFloodDir
      : prediction.meanEbbDir;
  const velocity = Math.abs(prediction.Velocity_Major);
  const date = new Date(prediction.Time);

  let color = LEGEND_COLORS[3];
  if (velocity < VELOCITY_BREAK_POINTS[1]) {
    color = LEGEND_COLORS[0];
  } else if (velocity < VELOCITY_BREAK_POINTS[2]) {
    color = LEGEND_COLORS[1];
  } else if (velocity < VELOCITY_BREAK_POINTS[3]) {
    color = LEGEND_COLORS[2];
  }

  const chartSvg = useMemo(
    () => buildCurrentChartSvg(predictions, clampedIndex),
    [predictions, clampedIndex]
  );

  return (
    <Marker
      position={[lat, lng]}
      icon={L.divIcon({
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        html: getIconHtml(rotation, color),
      })}
    >
      <Popup minWidth={330}>
        <div>
          <a
            href={
              id.startsWith("chs-")
                ? `https://www.tides.gc.ca/en/stations/${id.replace("chs-", "")}`
                : `https://tidesandcurrents.noaa.gov/noaacurrents/predictions?id=${id}`
            }
            rel="noreferrer"
            target="_blank"
            style={{ fontWeight: "bold" }}
          >
            {name}
          </a>
          <p style={{ margin: "4px 0" }}>
            {velocity.toFixed(1)} knots at{" "}
            {dateFormat(date, "ddd, mmm dS, h:MM TT")}
          </p>
          <div dangerouslySetInnerHTML={{ __html: chartSvg }} />
        </div>
      </Popup>
    </Marker>
  );
};

export default StationMarker;
