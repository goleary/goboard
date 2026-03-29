import React, { useMemo } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import dateFormat from "dateformat";

import { TideStationWithPrediction } from "../types";
import { getTempColor } from "./WaterTempMarker";
import "./station-icon.css";

const SIZE = 28;
const DEFAULT_FILL_COLOR = "#2166ac";
const EMPTY_COLOR = "#d1e5f0";

function getIconHtml(fillPercent: number, stationId: string, fillColor: string) {
  const r = SIZE / 2;
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
      <circle cx="${r}" cy="${r}" r="${r - 1}" fill="${fillColor}" clip-path="url(#${clipId})" />
      <circle cx="${r}" cy="${r}" r="${r - 1}" fill="none" stroke="white" stroke-width="2" />
    </svg>
  `;
}

function buildChartSvg(
  predictions: TideStationWithPrediction["predictions"],
  currentIndex: number
) {
  const w = 340;
  const h = 130;
  const pad = { top: 16, bottom: 24, left: 32, right: 16 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const levels = predictions.map((p) => p.waterLevel);
  const min = Math.min(...levels);
  const max = Math.max(...levels);
  const range = max - min || 1;

  const yMin = min - range * 0.05;
  const yMax = max + range * 0.05;
  const yRange = yMax - yMin;

  const toX = (i: number) => pad.left + (i / (levels.length - 1)) * chartW;
  const toY = (level: number) =>
    pad.top + chartH - ((level - yMin) / yRange) * chartH;

  // Line + filled area
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

  // Current position
  const cx = toX(currentIndex);
  const cy = toY(levels[currentIndex]);
  const nowLine = `<line x1="${cx.toFixed(1)}" y1="${pad.top}" x2="${cx.toFixed(1)}" y2="${pad.top + chartH}" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>`;

  // Y-axis ticks
  const nTicks = 4;
  const ticks = Array.from({ length: nTicks }, (_, i) => {
    const val = min + (i / (nTicks - 1)) * range;
    const y = toY(val);
    return [
      `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${pad.left + chartW}" y2="${y.toFixed(1)}" stroke="#f1f5f9" stroke-width="0.5"/>`,
      `<text x="${pad.left - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="9" font-weight="500" fill="#94a3b8">${val.toFixed(1)}</text>`,
    ].join("");
  }).join("");

  // High/low annotations
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
      const labelY = isHigh ? y - 7 : y + 12;
      annotations.push(
        `<text x="${x.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="9" font-weight="600" fill="#475569">${curr.toFixed(1)}m</text>`
      );
    }
  }

  // X-axis labels (12h intervals to avoid crowding)
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
        hour === 0
          ? dateFormat(d, "mmm d")
          : dateFormat(d, "h TT");
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
      <linearGradient id="tide-area-grad" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="${DEFAULT_FILL_COLOR}" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="${DEFAULT_FILL_COLOR}" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#f8fafc" />
    ${ticks}
    <polygon points="${areaPoints}" fill="url(#tide-area-grad)" />
    <polyline points="${linePoints}" fill="none" stroke="${DEFAULT_FILL_COLOR}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${annotations.join("")}
    ${nowLine}
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4.5" fill="#ef4444" stroke="white" stroke-width="2"/>
    ${xLabels.join("")}
    <text x="${pad.left}" y="${h - 4}" text-anchor="start" font-size="9" font-weight="500" fill="#cbd5e1">m</text>
  </svg>`;
}

const TideMarker: React.FC<TideStationWithPrediction & { index: number; waterTempF?: number }> = ({
  name,
  id,
  lat,
  lng,
  source,
  predictions,
  index,
  waterTempF,
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
  const isNoaa = source === "noaa-tide";
  const stationCode = isNoaa
    ? id.replace("noaa-tide-", "")
    : id.replace("chs-tide-", "");

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
        html: getIconHtml(fillPercent, id, waterTempF != null ? getTempColor(waterTempF) : DEFAULT_FILL_COLOR),
        className: "",
      })}
    >
      <Popup minWidth={340} closeButton={true}>
        <div className="station-popup">
          <a
            href={
              isNoaa
                ? `https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=${stationCode}`
                : `https://www.tides.gc.ca/en/stations/${stationCode}`
            }
            rel="noreferrer"
            target="_blank"
            className="station-popup__name"
          >
            {name}
          </a>
          <div className="station-popup__row">
            <div className="station-popup__reading">
              <span className="station-popup__value">{level.toFixed(2)}</span>
              <span className="station-popup__unit">m</span>
            </div>
            <div className="station-popup__time">
              {dateFormat(date, "ddd, mmm dS, h:MM TT")}
            </div>
          </div>
          {waterTempF != null && (
            <div className="station-popup__row">
              <div className="station-popup__reading">
                <span className="station-popup__value">{waterTempF.toFixed(1)}</span>
                <span className="station-popup__unit">&deg;F water temp</span>
              </div>
            </div>
          )}
          <div className="station-popup__meta">
            <a
              href={isNoaa ? "https://tidesandcurrents.noaa.gov" : "https://www.tides.gc.ca"}
              rel="noreferrer"
              target="_blank"
              className={`station-popup__badge station-popup__badge--${isNoaa ? "noaa" : "chs"}`}
            >
              {isNoaa ? "NOAA" : "CHS"}
            </a>
          </div>
          <div className="station-popup__chart">
            <div dangerouslySetInnerHTML={{ __html: chartSvg }} />
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default TideMarker;
