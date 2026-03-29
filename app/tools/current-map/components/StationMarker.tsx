import React, { useMemo } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

import dateFormat from "dateformat";

import { CurrentPrediction, StationWithPrediction } from "../types";
import "./station-icon.css";
import { LEGEND_COLORS, VELOCITY_BREAK_POINTS } from "./Legend";

const FLOOD_COLOR = "#3b82f6";
const EBB_COLOR = "#ef4444";

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
  const w = 340;
  const h = 130;
  const pad = { top: 22, bottom: 24, left: 32, right: 16 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const velocities = predictions.map((p) => p.Velocity_Major);
  const absMax =
    Math.max(Math.max(...velocities), Math.abs(Math.min(...velocities))) || 1;
  const yMax = absMax * 1.1;
  const yMin = -yMax;
  const yRange = yMax - yMin;

  const toX = (i: number) => pad.left + (i / (velocities.length - 1)) * chartW;
  const toY = (v: number) => pad.top + chartH - ((v - yMin) / yRange) * chartH;
  const zeroY = toY(0);

  // Build flood/ebb filled areas with gradient defs
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
        `<polygon points="${x0.toFixed(1)},${zeroY.toFixed(1)} ${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${zeroY.toFixed(1)}" fill="url(#flood-grad)" />`
      );
    } else if (v0 <= 0 && v1 <= 0) {
      ebbParts.push(
        `<polygon points="${x0.toFixed(1)},${zeroY.toFixed(1)} ${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${zeroY.toFixed(1)}" fill="url(#ebb-grad)" />`
      );
    } else {
      const t = v0 / (v0 - v1);
      const xCross = x0 + t * (x1 - x0);
      if (v0 >= 0) {
        floodParts.push(
          `<polygon points="${x0.toFixed(1)},${zeroY.toFixed(1)} ${x0.toFixed(1)},${y0.toFixed(1)} ${xCross.toFixed(1)},${zeroY.toFixed(1)}" fill="url(#flood-grad)" />`
        );
        ebbParts.push(
          `<polygon points="${xCross.toFixed(1)},${zeroY.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${zeroY.toFixed(1)}" fill="url(#ebb-grad)" />`
        );
      } else {
        ebbParts.push(
          `<polygon points="${x0.toFixed(1)},${zeroY.toFixed(1)} ${x0.toFixed(1)},${y0.toFixed(1)} ${xCross.toFixed(1)},${zeroY.toFixed(1)}" fill="url(#ebb-grad)" />`
        );
        floodParts.push(
          `<polygon points="${xCross.toFixed(1)},${zeroY.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${zeroY.toFixed(1)}" fill="url(#flood-grad)" />`
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
  const nowLine = `<line x1="${cx.toFixed(1)}" y1="${pad.top}" x2="${cx.toFixed(1)}" y2="${pad.top + chartH}" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>`;

  // Zero line
  const zeroLine = `<line x1="${pad.left}" y1="${zeroY.toFixed(1)}" x2="${pad.left + chartW}" y2="${zeroY.toFixed(1)}" stroke="#cbd5e1" stroke-width="0.75"/>`;

  // Y-axis ticks
  const niceMax = Math.ceil(absMax);
  const yTicks = [-niceMax, 0, niceMax]
    .map((val) => {
      const y = toY(val);
      return [
        val !== 0
          ? `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${pad.left + chartW}" y2="${y.toFixed(1)}" stroke="#f1f5f9" stroke-width="0.5"/>`
          : "",
        `<text x="${pad.left - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="9" font-weight="500" fill="#94a3b8">${val}</text>`,
      ].join("");
    })
    .join("");

  // Flood/Ebb labels
  const floodLabel = `<text x="${pad.left + chartW - 2}" y="${(pad.top + 10).toFixed(1)}" font-size="9" font-weight="600" fill="${FLOOD_COLOR}" opacity="0.5" text-anchor="end">FLOOD</text>`;
  const ebbLabel = `<text x="${pad.left + chartW - 2}" y="${(pad.top + chartH - 3).toFixed(1)}" font-size="9" font-weight="600" fill="${EBB_COLOR}" opacity="0.5" text-anchor="end">EBB</text>`;

  // X-axis time labels (12h intervals to avoid crowding)
  const xLabels: string[] = [];
  const seenLabels = new Set<string>();
  for (let i = 0; i < predictions.length; i++) {
    const d = new Date(predictions[i].Time);
    const hour = d.getHours();
    if (hour === 0 || hour === 12) {
      const key = `${d.getDate()}-${hour}`;
      if (seenLabels.has(key)) continue;
      seenLabels.add(key);
      const x = toX(i);
      if (x < pad.left + 10 || x > pad.left + chartW - 10) continue;
      const label =
        hour === 0 ? dateFormat(d, "mmm d") : dateFormat(d, "h TT");
      xLabels.push(
        `<line x1="${x.toFixed(1)}" y1="${pad.top + chartH}" x2="${x.toFixed(1)}" y2="${pad.top + chartH + 3}" stroke="#cbd5e1" stroke-width="0.5"/>`
      );
      if (hour === 0) {
        xLabels.push(
          `<line x1="${x.toFixed(1)}" y1="${pad.top}" x2="${x.toFixed(1)}" y2="${pad.top + chartH}" stroke="#f1f5f9" stroke-width="0.5"/>`
        );
      }
      xLabels.push(
        `<text x="${x.toFixed(1)}" y="${h - 4}" text-anchor="middle" font-size="9" font-weight="500" fill="#94a3b8">${label}</text>`
      );
    }
  }

  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
    <defs>
      <linearGradient id="flood-grad" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="${FLOOD_COLOR}" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="${FLOOD_COLOR}" stop-opacity="0.04"/>
      </linearGradient>
      <linearGradient id="ebb-grad" x1="0" x2="0" y1="1" y2="0">
        <stop offset="0%" stop-color="${EBB_COLOR}" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="${EBB_COLOR}" stop-opacity="0.04"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#f8fafc" />
    ${yTicks}
    ${zeroLine}
    ${floodParts.join("")}
    ${ebbParts.join("")}
    <polyline points="${linePoints}" fill="none" stroke="#334155" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${floodLabel}
    ${ebbLabel}
    ${nowLine}
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4.5" fill="#ef4444" stroke="white" stroke-width="2"/>
    ${xLabels.join("")}
    <text x="${pad.left}" y="${h - 4}" text-anchor="start" font-size="9" font-weight="500" fill="#cbd5e1">kn</text>
  </svg>`;
}

const StationMarker: React.FC<StationWithPrediction & { index: number }> = ({
  name,
  id,
  lat,
  lng,
  source,
  referenceStation,
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
  const isFlood = prediction.Velocity_Major > 0;

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

  const isChs = id.startsWith("chs-");

  return (
    <Marker
      position={[lat, lng]}
      icon={L.divIcon({
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        html: getIconHtml(rotation, color),
      })}
    >
      <Popup minWidth={340} closeButton={true}>
        <div className="station-popup">
          <a
            href={
              isChs
                ? `https://www.tides.gc.ca/en/stations/${id.replace("chs-", "")}`
                : `https://tidesandcurrents.noaa.gov/noaacurrents/predictions?id=${id}`
            }
            rel="noreferrer"
            target="_blank"
            className="station-popup__name"
          >
            {name}
          </a>
          <div className="station-popup__row">
            <div className="station-popup__reading">
              <span className="station-popup__value">{velocity.toFixed(1)}</span>
              <span className="station-popup__unit">
                kn {isFlood ? "flood" : "ebb"}
              </span>
            </div>
            <div className="station-popup__time">
              {dateFormat(date, "ddd, mmm dS, h:MM TT")}
            </div>
          </div>
          <div className="station-popup__meta">
            <a
              href={source === "chs" ? "https://www.tides.gc.ca" : "https://tidesandcurrents.noaa.gov"}
              rel="noreferrer"
              target="_blank"
              className={`station-popup__badge station-popup__badge--${source === "chs" ? "chs" : "noaa"}`}
            >
              {source === "chs" ? "CHS" : "NOAA"}
            </a>
            {referenceStation && (
              <span className="station-popup__derived">
                Derived from {referenceStation}
              </span>
            )}
          </div>
          <div className="station-popup__chart">
            <div dangerouslySetInnerHTML={{ __html: chartSvg }} />
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default StationMarker;
