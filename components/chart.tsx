"use client";

import React, { useEffect, useId, useRef, useState } from "react";

import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

type HistoricalRecord = {
  date: string;
  waterTemperature: number;
};

type HistoryChartProps = {
  historicalData: HistoricalRecord[];
};

const TEMP_COLOR_STOPS: Array<{ t: number; rgb: [number, number, number] }> = [
  { t: 45, rgb: [59, 130, 246] },   // blue-500
  { t: 50, rgb: [14, 165, 233] },   // sky-500
  { t: 55, rgb: [6, 182, 212] },    // cyan-500
  { t: 60, rgb: [20, 184, 166] },   // teal-500
  { t: 65, rgb: [16, 185, 129] },   // emerald-500
  { t: 70, rgb: [34, 197, 94] },    // green-500
  { t: 75, rgb: [234, 179, 8] },    // yellow-500
  { t: 80, rgb: [245, 158, 11] },   // amber-500
  { t: 85, rgb: [249, 115, 22] },   // orange-500
  { t: 90, rgb: [239, 68, 68] },    // red-500
];

function tempToColor(t: number): string {
  const s = TEMP_COLOR_STOPS;
  if (t <= s[0].t) return `rgb(${s[0].rgb.join(",")})`;
  if (t >= s[s.length - 1].t) return `rgb(${s[s.length - 1].rgb.join(",")})`;
  for (let i = 0; i < s.length - 1; i++) {
    if (t <= s[i + 1].t) {
      const k = (t - s[i].t) / (s[i + 1].t - s[i].t);
      const r = Math.round(s[i].rgb[0] + (s[i + 1].rgb[0] - s[i].rgb[0]) * k);
      const g = Math.round(s[i].rgb[1] + (s[i + 1].rgb[1] - s[i].rgb[1]) * k);
      const b = Math.round(s[i].rgb[2] + (s[i + 1].rgb[2] - s[i].rgb[2]) * k);
      return `rgb(${r},${g},${b})`;
    }
  }
  return `rgb(${s[0].rgb.join(",")})`;
}

const HistoryChart: React.FC<HistoryChartProps> = ({ historicalData }) => {
  const gradId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.floor(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = historicalData.length;
  const stops = n > 1
    ? historicalData.map((d, i) => ({
        offset: `${(i / (n - 1)) * 100}%`,
        color: tempToColor(d.waterTemperature),
      }))
    : [];

  return (
    <div ref={containerRef} className="w-full" style={{ height: 220 }}>
      {width > 0 && (
        <LineChart
          width={width}
          height={220}
          data={historicalData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`tempGrad-${gradId}`} x1="0" y1="0" x2="1" y2="0">
              {stops.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            dataKey="waterTemperature"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickFormatter={(value) => `${value.toFixed(0)}°F`}
            domain={["dataMin", "dataMax"]}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(value) => [`${Number(value).toFixed(1)}°F`, "Water"]}
          />
          <Line
            dataKey="waterTemperature"
            type="natural"
            stroke={`url(#tempGrad-${gradId})`}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      )}
    </div>
  );
};

export default HistoryChart;
