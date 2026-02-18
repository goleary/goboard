import {
  getMarkerPinHtml,
  getMarkerPinHtmlWithCustomGlyph,
  type MarkerIconOverride,
} from "../saunas/components/markerHtml";

const variants: {
  label: string;
  description: string;
  props: Parameters<typeof getMarkerPinHtml>[0];
}[] = [
  {
    label: "House (default)",
    description: "Default for saunas without distinguishing features",
    props: {
      isSelected: false,
      waterfront: false,
      coldPlunge: false,
      naturalPlunge: false,
      soakingTub: false,
      floating: false,
    },
  },
  {
    label: "Waves (natural plunge)",
    description: "Natural body of water cold plunge",
    props: {
      isSelected: false,
      waterfront: true,
      coldPlunge: true,
      naturalPlunge: true,
      soakingTub: false,
      floating: false,
    },
  },
  {
    label: "Snowflake (cold plunge)",
    description: "Cold plunge pool (not natural)",
    props: {
      isSelected: false,
      waterfront: false,
      coldPlunge: true,
      naturalPlunge: false,
      soakingTub: false,
      floating: false,
    },
  },
  {
    label: "Ship",
    description: "Marker override for boat-based saunas",
    props: {
      isSelected: false,
      waterfront: true,
      coldPlunge: true,
      naturalPlunge: true,
      soakingTub: false,
      floating: false,
      markerIconOverride: "ship" as MarkerIconOverride,
    },
  },
  {
    label: "Floating Sauna",
    description: "Floating saunas on water",
    props: {
      isSelected: false,
      waterfront: true,
      coldPlunge: true,
      naturalPlunge: true,
      soakingTub: false,
      floating: true,
    },
  },
  {
    label: "Soaking Tub",
    description: "Hot tub / thermal pool / soaking tub",
    props: {
      isSelected: false,
      waterfront: false,
      coldPlunge: false,
      naturalPlunge: false,
      soakingTub: true,
      floating: false,
    },
  },
];

export default function DebugIconsPage() {
  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-1 text-neutral-900">
          Icon Debug — Map Marker Icons
        </h1>
        <p className="text-sm text-neutral-500 mb-8">
          All marker icon variants — actual rendering from SaunaMarker
        </p>

        <div className="grid grid-cols-2 gap-4">
          {variants.map((v) => (
            <div
              key={v.label}
              className="bg-white rounded-xl border border-neutral-200 p-4"
            >
              <div className="mb-3">
                <h2 className="font-semibold text-neutral-900">{v.label}</h2>
                <p className="text-sm text-neutral-500">{v.description}</p>
              </div>
              <div className="flex items-end gap-6 bg-neutral-300 rounded-lg p-4">
                <div className="flex flex-col items-center gap-2">
                  <div
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: debug page rendering trusted marker HTML
                    dangerouslySetInnerHTML={{
                      __html: getMarkerPinHtml(v.props),
                    }}
                  />
                  <span className="text-[10px] text-neutral-400 font-mono">
                    default
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: debug page rendering trusted marker HTML
                    dangerouslySetInnerHTML={{
                      __html: getMarkerPinHtml({
                        ...v.props,
                        isSelected: true,
                      }),
                    }}
                  />
                  <span className="text-[10px] text-neutral-400 font-mono">
                    selected
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold mt-10 mb-4 text-neutral-900">
          Soaking Tub — Candidate Icons
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Current",
              glyph: `<svg width="16" height="16" viewBox="0 0 512 512" fill="none" aria-hidden="true"><path fill="white" d="M272 24c0-13.3-10.7-24-24-24s-24 10.7-24 24v5.2c0 34 14.4 66.4 39.7 89.2l16.4 14.8c15.2 13.7 23.8 33.1 23.8 53.5v13.2c0 13.3 10.7 24 24 24s24-10.7 24-24v-13.2c0-34-14.4-66.4-39.7-89.2l-16.4-14.7C280.7 69.1 272 49.7 272 29.2zM0 320v128c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V320c0-35.3-28.7-64-64-64H277.3c-13.8 0-27.3-4.5-38.4-12.8l-85.3-64C137 166.7 116.8 160 96 160c-53 0-96 43-96 96zm128 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16v-96c0-8.8 7.2-16 16-16s16 7.2 16 16m80-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16v-96c0-8.8 7.2-16 16-16m112 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16v-96c0-8.8 7.2-16 16-16s16 7.2 16 16m80-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16v-96c0-8.8 7.2-16 16-16M360 0c-13.3 0-24 10.7-24 24v5.2c0 34 14.4 66.4 39.7 89.2l16.4 14.8c15.2 13.7 23.8 33.1 23.8 53.5v13.2c0 13.3 10.7 24 24 24s24-10.7 24-24v-13.2c0-34-14.4-66.4-39.7-89.2l-16.4-14.7C392.7 69.1 384 49.7 384 29.2V24c0-13.3-10.7-24-24-24M64 128A64 64 0 1 0 64 0a64 64 0 1 0 0 128"/></svg>`,
            },
            {
              label: "Candidate A (outline)",
              glyph: `<svg width="16" height="16" viewBox="0 1 24 22" fill="none" aria-hidden="true"><g stroke="white" stroke-linecap="round" stroke-width="2"><path stroke-linejoin="round" d="M3.664 16.986L3 13h18l-.664 3.986c-.4 2.395-.599 3.592-1.438 4.303c-.84.711-2.053.711-4.48.711H9.582c-2.428 0-3.642 0-4.48-.71c-.84-.712-1.04-1.91-1.439-4.304"/><path d="M18.6 10a1.45 1.45 0 0 0 0-2a1.45 1.45 0 0 1 0-2m-3.2 4a1.45 1.45 0 0 0 0-2a1.45 1.45 0 0 1 0-2"/><path stroke-linejoin="round" d="M3 13H2m19 0h1M5 13V9.851C5 8.83 5.829 8 6.851 8c1.329 0 2.556.712 3.215 1.866L13 15M9 4a2 2 0 1 1-4 0a2 2 0 0 1 4 0"/></g></svg>`,
            },
            {
              label: "Candidate B (filled)",
              glyph: `<svg width="16" height="16" viewBox="70 60 500 520" fill="none" aria-hidden="true"><path fill="white" d="M336 104c0 13.6 5.8 26.5 15.8 35.6l26.5 23.8c24 21.6 37.7 52.3 37.7 84.6c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-18.7-7.9-36.4-21.8-48.9l-26.5-23.8C299.5 157.1 288 131.2 288 104c0-13.3 10.7-24 24-24s24 10.7 24 24M96 400v-80c0-35.3 28.7-64 64-64h19.7c8.1 0 16.2 1.6 23.8 4.6l137.1 54.8c7.6 3 15.6 4.6 23.8 4.6H480c35.3 0 64 28.7 64 64v128c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64zm96-16c-13.3 0-24 10.7-24 24v80c0 13.3 10.7 24 24 24s24-10.7 24-24v-80c0-13.3-10.7-24-24-24m152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24v80c0 13.3 10.7 24 24 24s24-10.7 24-24zm104-24c-13.3 0-24 10.7-24 24v80c0 13.3 10.7 24 24 24s24-10.7 24-24v-80c0-13.3-10.7-24-24-24M424 80c13.3 0 24 10.7 24 24c0 13.6 5.8 26.5 15.8 35.6l26.5 23.8c24 21.6 37.7 52.3 37.7 84.6c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-18.7-7.9-36.4-21.8-48.9l-26.5-23.8C411.5 157.1 400 131.2 400 104c0-13.3 10.7-24 24-24m-264 24c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56"/></svg>`,
            },
          ].map((candidate) => (
            <div
              key={candidate.label}
              className="bg-white rounded-xl border border-neutral-200 p-4"
            >
              <h3 className="font-semibold text-neutral-900 mb-3">
                {candidate.label}
              </h3>
              <div className="flex items-end gap-6 bg-neutral-300 rounded-lg p-4">
                <div
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: debug page rendering trusted marker HTML
                  dangerouslySetInnerHTML={{
                    __html: getMarkerPinHtmlWithCustomGlyph({
                      pinColor: "#E65A3A",
                      glyph: candidate.glyph,
                    }),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold mt-10 mb-4 text-neutral-900">
          Boat — Candidate Icons
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Current (Lucide ship)",
              glyph: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10.189V14"></path><path d="M12 2v3"></path><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"></path><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76"></path><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path></svg>`,
            },
            {
              label: "Candidate A (outline sailboat)",
              glyph: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 1 2-1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 1 2-1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1M4 18l-1-5h18l-2 4M5 13V7h8l4 6M7 7V3H6"/></svg>`,
            },
            {
              label: "Candidate B (filled, half)",
              glyph: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill="white" d="M14.211 17.776a4 4 0 0 1 3.364-.099l.214.1l2.658 1.328a1 1 0 0 1-.787 1.835l-.107-.046l-2.659-1.329a2 2 0 0 0-1.617-.076l-.172.076l-1.316.659a4 4 0 0 1-3.365.098l-.213-.098l-1.317-.659a2 2 0 0 0-1.617-.076l-.172.076l-2.658 1.33a1 1 0 0 1-.996-1.731l.102-.059l2.658-1.329a4 4 0 0 1 3.364-.099l.214.1l1.316.658a2 2 0 0 0 1.618.076l.171-.076zM13 2a1 1 0 0 1 1 1v1.32l3.329.554a2 2 0 0 1 1.67 1.973v3.432l2.06.686a1.25 1.25 0 0 1 .753 1.679l-2.169 5.06l-1.854-.928a4 4 0 0 0-3.578 0l-1.317.659a2 2 0 0 1-1.789 0l-1.316-.659a4 4 0 0 0-3.578 0l-1.27.636l-2.658-4.651a1.25 1.25 0 0 1 .69-1.806L5 10.279V6.847a2 2 0 0 1 1.67-1.973L10 4.32V3a1 1 0 0 1 1-1zm-1 4.014l-5 .833v2.766l4.367-1.456a2 2 0 0 1 1.265 0L17 9.613V6.847z"/></svg>`,
            },
            {
              label: "Candidate C (filled, full)",
              glyph: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill="white" d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.32l3.329.554a2 2 0 0 1 1.67 1.973v3.432l2.06.686a1.25 1.25 0 0 1 .753 1.679l-2.521 5.883l1.156.579a1 1 0 1 1-.894 1.788l-2.659-1.329a2 2 0 0 0-1.788 0l-1.317.659a4 4 0 0 1-3.578 0l-1.317-.659a2 2 0 0 0-1.789 0l-2.658 1.33a1 1 0 1 1-.894-1.79l1.832-.916l-3.102-5.428a1.25 1.25 0 0 1 .69-1.806L5 10.279V6.847a2 2 0 0 1 1.67-1.973L10 4.32zM7.25 17.425a4 4 0 0 1 2.538.351l1.316.659a2 2 0 0 0 1.79 0l1.316-.659a4 4 0 0 1 3.282-.133l2.16-5.038L12 10.055l-7.527 2.508zM17 9.613V6.847l-5-.833l-5 .833v2.766l4.367-1.456a2 2 0 0 1 1.265 0z"/></svg>`,
            },
            {
              label: "Candidate D (filled, cruise)",
              glyph: `<svg width="16" height="16" viewBox="0 0 576 512" fill="none" aria-hidden="true"><path fill="white" d="M192 32c0-17.7 14.3-32 32-32h128c17.7 0 32 14.3 32 32v32h48c26.5 0 48 21.5 48 48v128l44.4 14.8c23.1 7.7 29.5 37.5 11.5 53.9l-101 92.6c-16.2 9.4-34.7 15.1-50.9 15.1c-19.6 0-40.8-7.7-59.2-20.3c-22.1-15.5-51.6-15.5-73.7 0c-17.1 11.8-38 20.3-59.2 20.3c-16.2 0-34.7-5.7-50.9-15.1L40 308.7c-18-16.5-11.6-46.2 11.5-53.9L96 240V112c0-26.5 21.5-48 48-48h48zm-32 186.7l107.8-35.9c13.1-4.4 27.3-4.4 40.5 0L416 218.7V128H160zm146.5 203.2c22.5 15.5 50 26.1 77.5 26.1c26.9 0 55.4-10.8 77.4-26.1c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25c-29 15.6-61.5 25.9-94.5 25.9c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.4 27.3-10.1 39.2-1.7c22.1 15.2 50.5 26 77.4 26c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0"/></svg>`,
            },
            {
              label: "Candidate E (filled, ionicons)",
              glyph: `<svg width="16" height="16" viewBox="0 0 512 512" fill="none" aria-hidden="true"><path fill="white" d="M416 473.14a6.83 6.83 0 0 0-3.57-6c-27.07-14.55-51.76-36.82-62.62-48a10.05 10.05 0 0 0-12.72-1.51c-50.33 32.42-111.61 32.44-161.95.05a10.09 10.09 0 0 0-12.82 1.56c-10.77 11.28-35.19 33.3-62.43 47.75a7.11 7.11 0 0 0-3.89 5.73a6.73 6.73 0 0 0 7.92 7.15c20.85-4.18 41-13.68 60.2-23.83a8.71 8.71 0 0 1 8-.06a185.14 185.14 0 0 0 167.81 0a8.82 8.82 0 0 1 8.09.06c19.1 10 39.22 19.59 60 23.8a6.73 6.73 0 0 0 8-6.71Zm60.71-226.23c-3.49-8.39-10.9-14.89-20.9-18.35L432 219.08V136a64 64 0 0 0-64-64h-32v-8a40 40 0 0 0-40-40h-80a40 40 0 0 0-40 40v8h-32a64 64 0 0 0-64 64v83.15l-23.58 9.39c-9.94 3.3-17.63 10-21.15 18.44c-2.45 5.89-5.25 15-1.3 26.46l.1.3l46.66 119.44A23.33 23.33 0 0 0 102.58 408c.5 0 1 0 1.53-.05c31.32-2 56-17.27 72.6-31.61C200.42 396.81 228.31 408 256 408s55.43-11.2 79.14-31.7c16.59 14.36 41.3 29.67 72.61 31.65a23.36 23.36 0 0 0 23.37-14.74l46.65-119c3.28-8.09 2.9-17.76-1.06-27.3M269 154.21l-1.14-.4a39.53 39.53 0 0 0-23.73 0l-.58.18l-126.07 50.23a4 4 0 0 1-5.48-3.72V136a32 32 0 0 1 32-32h224a32 32 0 0 1 32 32v64.44a4 4 0 0 1-5.48 3.72Z"/></svg>`,
            },
            {
              label: "Candidate F (filled, blocky)",
              glyph: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill="white" d="M4 10.4V4a1 1 0 0 1 1-1h5V1h4v2h5a1 1 0 0 1 1 1v6.4l1.086.326a1 1 0 0 1 .683 1.2l-1.517 6.068A4.99 4.99 0 0 1 16 16a5 5 0 0 1-4 2a5 5 0 0 1-4-2a4.99 4.99 0 0 1-4.252 1.994l-1.516-6.068a1 1 0 0 1 .682-1.2zm2-.6L12 8l2.754.826l1.809.543L18 9.8V5H6zM4 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 12 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 20 20h2v2h-2a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 12 22a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 4 22H2v-2z"/></svg>`,
            },
          ].map((candidate) => (
            <div
              key={candidate.label}
              className="bg-white rounded-xl border border-neutral-200 p-4"
            >
              <h3 className="font-semibold text-neutral-900 mb-3">
                {candidate.label}
              </h3>
              <div className="flex items-end gap-6 bg-neutral-300 rounded-lg p-4">
                <div
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: debug page rendering trusted marker HTML
                  dangerouslySetInnerHTML={{
                    __html: getMarkerPinHtmlWithCustomGlyph({
                      pinColor: "#1A73E8",
                      glyph: candidate.glyph,
                    }),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold mt-10 mb-4 text-neutral-900">
          Floating Sauna — Candidate Icons
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Current",
              glyph: getMarkerPinHtml({
                isSelected: false,
                waterfront: true,
                coldPlunge: true,
                naturalPlunge: true,
                soakingTub: false,
                floating: true,
              }),
              raw: true,
            },
            {
              label: "Candidate A (pixel art)",
              glyph: `<svg width="16" height="16" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path fill="white" d="M9 2.08V1h2v1.43c.65.15 1.31.34 2 .57v1.5H2V3c2-.67 3.83-1 5.5-1c.49 0 .99.03 1.5.08M9.68 13h-.14c-.18.02-.35.09-.48.22c-.14.12-.27.24-.42.36c-.73.57-1.78.55-2.48-.07l-.39-.34a.7.7 0 0 0-.36-.17h-.28c-.13.02-.26.08-.36.17c-.19.15-.36.31-.55.46c-.7.51-1.67.49-2.35-.06l-.31-.26A.92.92 0 0 0 1 13v-.97c.26-.04.52.01.75.13c.28.17.54.36.79.57c.16.17.38.26.61.27c.04-.01.09-.01.14-.01c.02-.01.04-.01.06-.02c.11-.03.22-.08.31-.15c.16-.12.29-.26.45-.38c.27-.22.58-.36.9-.41c.14-.05.29-.06.44-.02c.4.02.79.16 1.11.43c.16.12.31.27.47.4c.08.07.18.12.27.15c.19.01.38 0 .56-.04a1 1 0 0 0 .17-.11c.16-.13.31-.28.47-.4c.26-.22.56-.35.87-.41c.11-.03.21-.04.32-.03c.45-.01.9.14 1.27.44c.15.12.29.26.44.38c.13.11.28.17.44.18c.09 0 .18-.01.28-.03c.1-.03.2-.08.28-.15l.47-.4c.32-.26.72-.4 1.13-.39V13c-.26.02-.51.14-.68.34c-.27.28-.62.48-1 .58c-.61.18-1.28.05-1.77-.36l-.39-.34c-.13-.13-.3-.2-.48-.22m-1.97 0q-.18.045-.36 0zM13 11.32c-.04.03-.09.06-.13.1l-.47.4c-.29.24-.71.24-1 0c-.15-.12-.29-.26-.44-.38a1.93 1.93 0 0 0-2.46 0c-.16.12-.31.27-.47.4c-.29.24-.71.24-1 0c-.16-.13-.31-.28-.47-.4c-.71-.58-1.74-.58-2.45 0c-.16.12-.29.26-.45.38a.84.84 0 0 1-1.12-.09c-.17-.15-.35-.28-.54-.41V10h11zM9 9.5V7H6v2.5H3V5h9v4.5z"/></svg>`,
              raw: false,
            },
            {
              label: "Candidate B (filled, MUI)",
              glyph: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill="white" d="M22 17.83c0-.42-.27-.8-.67-.94c-.71-.27-1.12-.89-2.66-.89c-1.91 0-2.14 1-3.33 1c-1.24 0-1.39-1-3.34-1s-2.1 1-3.34 1c-1.19 0-1.42-1-3.33-1c-1.54 0-1.95.62-2.66.88c-.4.15-.67.52-.67.95c0 .7.69 1.19 1.35.95c.8-.29 1.18-.78 2-.78c1.19 0 1.42 1 3.33 1c1.95 0 2.08-1 3.32-1s1.37 1 3.32 1c1.91 0 2.14-1 3.33-1c.83 0 1.21.49 2 .78c.66.24 1.35-.26 1.35-.95m-3.09-8.02a.996.996 0 0 0-.22-1.4l-6.1-4.47a.99.99 0 0 0-1.18 0l-6.1 4.47c-.45.33-.54.95-.22 1.4c.33.45.95.54 1.4.22L7 9.65V13H5.74c-.27 0-.52-.11-.71-.29l-.66-.66a.996.996 0 1 0-1.41 1.41l.66.66c.56.56 1.33.88 2.12.88h12.51c.8 0 1.56-.32 2.12-.88l.66-.66a.996.996 0 1 0-1.41-1.41l-.66.66c-.18.18-.44.29-.7.29H17V9.65l.51.37c.45.33 1.07.23 1.4-.21M13 13h-2v-2h2z"/></svg>`,
              raw: false,
            },
          ].map((candidate) => (
            <div
              key={candidate.label}
              className="bg-white rounded-xl border border-neutral-200 p-4"
            >
              <h3 className="font-semibold text-neutral-900 mb-3">
                {candidate.label}
              </h3>
              <div className="flex items-end gap-6 bg-neutral-300 rounded-lg p-4">
                <div
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: debug page rendering trusted marker HTML
                  dangerouslySetInnerHTML={{
                    __html: candidate.raw
                      ? candidate.glyph
                      : getMarkerPinHtmlWithCustomGlyph({
                          pinColor: "#1A73E8",
                          glyph: candidate.glyph,
                        }),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
