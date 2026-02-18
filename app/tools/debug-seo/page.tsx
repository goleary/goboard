import { saunas, locations, getSaunasForLocation, buildSaunaMetaDescription, describeLocationAmenities } from "@/data/saunas/saunas";

const BASE_URL = "https://goleary.com";
const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

function truncate(text: string, limit: number) {
  if (text.length <= limit) return { text, over: false };
  return { text: text.slice(0, limit), over: true };
}

function SearchResult({ title, url, description }: { title: string; url: string; description: string }) {
  const t = truncate(title, TITLE_LIMIT);
  const d = truncate(description, DESC_LIMIT);

  return (
    <div className="max-w-[600px] mb-6">
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#202124]/60 mb-0.5 truncate block hover:underline">{url}</a>
      <div className="text-lg leading-snug mb-0.5">
        <a href={url} target="_blank" rel="noopener noreferrer" className={`text-[#1a0dab] hover:underline cursor-pointer`}>
          {t.text}
          {t.over && <span className="text-red-500">...</span>}
        </a>
        {t.over && (
          <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
            {title.length}/{TITLE_LIMIT}
          </span>
        )}
      </div>
      <div className="text-sm text-[#4d5156] leading-relaxed">
        {d.text}
        {d.over && <span className="text-red-500">...</span>}
        {d.over && (
          <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded inline-block">
            {description.length}/{DESC_LIMIT}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DebugSeoPage() {
  const locationResults = locations.map((loc) => {
    const locationSaunas = getSaunasForLocation(loc);
    const count = locationSaunas.length;
    const amenitySummary = describeLocationAmenities(locationSaunas);
    return {
      title: `${loc.name} Saunas - Compare${count >= 4 ? ` ${count}` : ""} Saunas & Bathhouses`,
      url: `${BASE_URL}/tools/saunas/${loc.slug}`,
      description: `${loc.description} ${amenitySummary}`,
    };
  });

  const saunaResults = saunas.flatMap((sauna) => {
    const matchingLocations = locations.filter(() => true);
    const loc = matchingLocations[0];
    if (!loc) return [];
    return [{
      title: `${sauna.name} - ${loc.name} Saunas`,
      url: `${BASE_URL}/tools/saunas/${loc.slug}?sauna=${sauna.slug}`,
      description: buildSaunaMetaDescription(sauna),
      slug: sauna.slug,
    }];
  });

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-1 text-[#202124]">SEO Debug — Search Result Previews</h1>
        <p className="text-sm text-[#5f6368] mb-8">
          Title limit: {TITLE_LIMIT} chars | Description limit: {DESC_LIMIT} chars |{" "}
          <span className="text-red-500">Red</span> = truncated by Google
        </p>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-[#202124] mb-4 border-b pb-2">
            Location Pages ({locationResults.length})
          </h2>
          {locationResults.map((r) => (
            <SearchResult key={r.url} {...r} />
          ))}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#202124] mb-4 border-b pb-2">
            Individual Sauna Pages ({saunaResults.length})
          </h2>
          {saunaResults.map((r) => (
            <SearchResult key={r.slug} title={r.title} url={r.url} description={r.description} />
          ))}
        </section>
      </div>
    </div>
  );
}
