import React from "react";
import { interpolateInferno } from "d3-scale-chromatic";

export const MAX_VELOCITY = 7;

// Generate CSS gradient stops from inferno scale (same 0.15–0.85 range as StationMarker)
const GRADIENT_STOPS = Array.from({ length: 10 }, (_, i) => {
  const t = i / 9;
  const color = interpolateInferno(t * 0.7 + 0.15);
  return `${color} ${(t * 100).toFixed(0)}%`;
}).join(", ");

const Legend: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        margin: "auto",
        top: "20vh",
        right: 24,
        zIndex: 400,
        padding: 8,
        border: "1px solid gray",
        backgroundColor: "white",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        maxWidth: 140,
      }}
    >
      <div style={{ fontSize: 14, padding: "8px 0 4px", textAlign: "center", fontWeight: "bold" }}>
        Current speed
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          fontSize: 12,
        }}
      >
        <div
          style={{
            backgroundColor: "#94a3b8",
            width: 8,
            height: 8,
            borderRadius: "50%",
            marginRight: 10,
            marginLeft: 2,
          }}
        ></div>
        {"< 0.3 kn (slack)"}
      </div>
      <div
        style={{
          height: 12,
          borderRadius: 3,
          margin: "4px 0",
          background: `linear-gradient(to right, ${GRADIENT_STOPS})`,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#666",
        }}
      >
        <span>0 kn</span>
        <span>{MAX_VELOCITY}+ kn</span>
      </div>
      <div
        style={{
          borderTop: "1px solid #ddd",
          marginTop: 8,
          paddingTop: 4,
          fontSize: 14,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Tide level
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 12,
          gap: 8,
          padding: "4px 0",
        }}
      >
        <svg width="24" height="12" viewBox="0 0 24 12">
          <circle cx="6" cy="6" r="5" fill="#d1e5f0" stroke="white" strokeWidth="1" />
          <circle cx="18" cy="6" r="5" fill="#d1e5f0" stroke="white" strokeWidth="1" />
          <clipPath id="legend-fill">
            <rect x="13" y="0" width="10" height="12" />
          </clipPath>
          <circle cx="18" cy="6" r="5" fill="#2166ac" clipPath="url(#legend-fill)" />
        </svg>
        low — high
      </div>
      <div
        style={{
          borderTop: "1px solid #ddd",
          marginTop: 8,
          paddingTop: 4,
          fontSize: 14,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Water temp
      </div>
      {[
        { color: "#3b82f6", label: "< 45°F" },
        { color: "#0ea5e9", label: "45-50°F" },
        { color: "#06b6d4", label: "50-55°F" },
        { color: "#14b8a6", label: "55-60°F" },
        { color: "#22c55e", label: "60-65°F" },
        { color: "#eab308", label: "65-70°F" },
        { color: "#f97316", label: "> 70°F" },
      ].map(({ color, label }) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 12,
            gap: 8,
            padding: "1px 0",
          }}
        >
          <div
            style={{
              backgroundColor: color,
              width: 12,
              height: 12,
              borderRadius: "50%",
            }}
          />
          {label}
        </div>
      ))}
      <div style={{ fontSize: 12, padding: "8px 0 4px", textAlign: "center" }}>
        built by{" "}
        <a href="/" className="underline text-nowrap">
          {"Gabe O'Leary"}
        </a>
      </div>
    </div>
  );
};
export default Legend;
