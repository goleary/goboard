import React from "react";

export const LEGEND_COLORS = ["#0d0887", "#7e03a8", "#cc4778", "#f89540"];
export const VELOCITY_BREAK_POINTS = [0, 1, 3, 5];

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
      {LEGEND_COLORS.map((color, i) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontSize: 12,
          }}
          key={`current-${i}`}
        >
          <div
            style={{
              backgroundColor: color,
              width: 12,
              height: 12,
              marginRight: 8,
            }}
          ></div>
          {i < LEGEND_COLORS.length - 1
            ? `${VELOCITY_BREAK_POINTS[i]}-${VELOCITY_BREAK_POINTS[i + 1]}`
            : `${VELOCITY_BREAK_POINTS[i]}+ `}
          {` knots`}
        </div>
      ))}
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
