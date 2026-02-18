import {
  getMarkerPinHtml,
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
      </div>
    </div>
  );
}
