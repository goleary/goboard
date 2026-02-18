type IconNode = Array<
  [
    tagName: "path" | "circle" | "line" | "polyline" | "polygon" | "rect",
    attrs: Record<string, string>,
  ]
>;

const HOUSE_ICON_NODE: IconNode = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    },
  ],
];

const WAVES_ICON_NODE: IconNode = [
  [
    "path",
    {
      d: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
    },
  ],
  [
    "path",
    {
      d: "M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
    },
  ],
  [
    "path",
    {
      d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
    },
  ],
];

const SNOWFLAKE_ICON_NODE: IconNode = [
  ["path", { d: "m10 20-1.25-2.5L6 18" }],
  ["path", { d: "M10 4 8.75 6.5 6 6" }],
  ["path", { d: "m14 20 1.25-2.5L18 18" }],
  ["path", { d: "m14 4 1.25 2.5L18 6" }],
  ["path", { d: "m17 21-3-6h-4" }],
  ["path", { d: "m17 3-3 6 1.5 3" }],
  ["path", { d: "M2 12h6.5L10 9" }],
  ["path", { d: "m20 10-1.5 2 1.5 2" }],
  ["path", { d: "M22 12h-6.5L14 15" }],
  ["path", { d: "m4 10 1.5 2L4 14" }],
  ["path", { d: "m7 21 3-6-1.5-3" }],
  ["path", { d: "m7 3 3 6h4" }],
];

const SHIP_ICON_NODE: IconNode = [
  ["path", { d: "M12 10.189V14" }],
  ["path", { d: "M12 2v3" }],
  ["path", { d: "M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" }],
  [
    "path",
    {
      d: "M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76",
    },
  ],
  [
    "path",
    {
      d: "M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
    },
  ],
];

const renderFloatingSaunaGlyph = (strokeWidth: number) => `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      fill="white"
      fill-rule="evenodd"
      d="M12 4 L21 11 H19 V18 H5 V11 H3 Z M10 14 H14 V18 H10 Z"
    />
    <path
      d="M0 21c.65.5 1.3 1 2.7 1 2.7 0 2.7-2 5.4-2 2.8 0 2.6 2 5.4 2 2.7 0 2.7-2 5.4-2 2.7 0 2.7 2 5.1 2"
      stroke="white"
      stroke-width="${strokeWidth}"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

const renderSoakingTubGlyph = () => `
  <svg width="14" height="14" viewBox="0 0 512 512" fill="none" aria-hidden="true">
    <path
      fill="white"
      d="M272 24c0-13.3-10.7-24-24-24s-24 10.7-24 24v5.2c0 34 14.4 66.4 39.7 89.2l16.4 14.8c15.2 13.7 23.8 33.1 23.8 53.5v13.2c0 13.3 10.7 24 24 24s24-10.7 24-24v-13.2c0-34-14.4-66.4-39.7-89.2l-16.4-14.7C280.7 69.1 272 49.7 272 29.2zM0 320v128c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V320c0-35.3-28.7-64-64-64H277.3c-13.8 0-27.3-4.5-38.4-12.8l-85.3-64C137 166.7 116.8 160 96 160c-53 0-96 43-96 96zm128 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16v-96c0-8.8 7.2-16 16-16s16 7.2 16 16m80-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16v-96c0-8.8 7.2-16 16-16m112 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16v-96c0-8.8 7.2-16 16-16s16 7.2 16 16m80-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16v-96c0-8.8 7.2-16 16-16M360 0c-13.3 0-24 10.7-24 24v5.2c0 34 14.4 66.4 39.7 89.2l16.4 14.8c15.2 13.7 23.8 33.1 23.8 53.5v13.2c0 13.3 10.7 24 24 24s24-10.7 24-24v-13.2c0-34-14.4-66.4-39.7-89.2l-16.4-14.7C392.7 69.1 384 49.7 384 29.2V24c0-13.3-10.7-24-24-24M64 128A64 64 0 1 0 64 0a64 64 0 1 0 0 128"
    />
  </svg>
`;

const renderLucideGlyph = (
  iconNode: IconNode,
  strokeWidth: number,
  viewBox = "0 0 24 24",
) => {
  const paths = iconNode
    .map(([tagName, attrs]) => {
      const attrText = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
      return `<${tagName} ${attrText}></${tagName}>`;
    })
    .join("");

  return `
    <svg width="14" height="14" viewBox="${viewBox}" fill="none" aria-hidden="true" stroke="white" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
      ${paths}
    </svg>
  `;
};

export type MarkerIconOverride =
  | "house"
  | "waves"
  | "snowflake"
  | "ship"
  | "floating-sauna";

const PIN_PATH =
  "M20 1C10.6112 1 3 8.6112 3 18C3 26 6 33 20 42C34 33 37 26 37 18C37 8.6112 29.3888 1 20 1Z";

export function getMarkerPinHtml({
  isSelected,
  waterfront,
  coldPlunge,
  naturalPlunge,
  soakingTub,
  floating,
  markerIconOverride,
}: {
  isSelected: boolean;
  waterfront: boolean;
  coldPlunge: boolean;
  naturalPlunge: boolean;
  soakingTub: boolean;
  floating: boolean;
  markerIconOverride?: MarkerIconOverride;
}): string {
  const pinWidth = 36;
  const pinHeight = 46;
  const isColdPlungeWithoutNaturalPlunge = coldPlunge && !naturalPlunge;
  const pinColor = naturalPlunge
    ? "#1A73E8"
    : soakingTub
      ? "#E65A3A"
      : isColdPlungeWithoutNaturalPlunge
        ? "#5FA8FF"
        : "#E65A3A";
  const pinShellColor = "#FFFFFF";
  const filter = isSelected
    ? `drop-shadow(0 0 4px ${pinColor}) drop-shadow(0 0 8px ${pinColor})`
    : "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))";
  const glyphStrokeWidth = 2.3;
  const glyph = markerIconOverride
    ? markerIconOverride === "ship"
      ? renderLucideGlyph(SHIP_ICON_NODE, glyphStrokeWidth)
      : markerIconOverride === "waves"
        ? renderLucideGlyph(WAVES_ICON_NODE, glyphStrokeWidth)
        : markerIconOverride === "snowflake"
          ? renderLucideGlyph(SNOWFLAKE_ICON_NODE, glyphStrokeWidth)
          : markerIconOverride === "floating-sauna"
            ? renderFloatingSaunaGlyph(glyphStrokeWidth)
            : renderLucideGlyph(HOUSE_ICON_NODE, glyphStrokeWidth)
    : floating
      ? renderFloatingSaunaGlyph(glyphStrokeWidth)
      : naturalPlunge
        ? renderLucideGlyph(WAVES_ICON_NODE, glyphStrokeWidth)
        : soakingTub
          ? renderSoakingTubGlyph()
          : isColdPlungeWithoutNaturalPlunge
            ? renderLucideGlyph(SNOWFLAKE_ICON_NODE, glyphStrokeWidth)
            : waterfront
              ? renderLucideGlyph(WAVES_ICON_NODE, glyphStrokeWidth)
              : renderLucideGlyph(HOUSE_ICON_NODE, glyphStrokeWidth);

  return `
    <div style="
      width: ${pinWidth}px;
      height: ${pinHeight}px;
      position: relative;
      filter: ${filter};
      cursor: pointer;
      transition: transform 0.15s ease;
    ">
      <svg
        width="${pinWidth}"
        height="${pinHeight}"
        viewBox="0 0 40 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="display: block;"
        aria-hidden="true"
      >
        <path d="${PIN_PATH}" fill="${pinShellColor}" />
        <circle cx="20" cy="18" r="14" fill="${pinColor}" />
      </svg>
      <div style="
        position: absolute;
        left: 50%;
        top: 15.6px;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
      ">
        ${glyph}
      </div>
    </div>
  `;
}
