import { Metadata } from "next";
import { seattleSaunas, getLatestUpdateDate } from "@/data/saunas/seattle-saunas";
import { SaunasClient } from "./components/SaunasClient";
import dayjs from "dayjs";

export const metadata: Metadata = {
  title: "Seattle Saunas - Compare Local Sauna & Bathhouse Options",
  description:
    "Compare Seattle saunas and bathhouses by price, amenities, and location. Find the perfect sauna experience with cold plunge, steam rooms, and private options.",
  openGraph: {
    title: "Seattle Saunas - Compare Local Sauna & Bathhouse Options",
    description:
      "Compare Seattle saunas and bathhouses by price, amenities, and location. Find the perfect sauna experience.",
    url: "https://goleary.com/seattle-saunas",
    type: "website",
  },
  alternates: {
    canonical: "https://goleary.com/seattle-saunas",
  },
};

// Generate schema.org ItemList for SEO
function generateItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Seattle Saunas",
    description: "A curated list of saunas and bathhouses in Seattle, WA",
    numberOfItems: seattleSaunas.length,
    itemListElement: seattleSaunas.map((sauna, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://goleary.com/seattle-saunas/${sauna.slug}`,
      name: sauna.name,
    })),
  };
}

export default function SeattleSaunasPage() {
  const lastUpdated = getLatestUpdateDate();
  const formattedDate = dayjs(lastUpdated).format("MMMM D, YYYY");

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateItemListSchema()),
        }}
      />

      <article className="space-y-6">
        {/* SEO-first content */}
        <header>
          <h1 className="text-3xl font-bold mb-3">Seattle Saunas</h1>
          <p className="text-muted-foreground leading-relaxed">
            Looking for the best sauna experience in Seattle? This guide
            compares local saunas and bathhouses across the city, from
            traditional Russian banyas to modern Nordic-inspired spaces. Filter
            by amenities like cold plunge, steam room, and private rooms to find
            your perfect heat therapy destination.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {formattedDate}
          </p>
        </header>

        {/* Interactive client component */}
        <SaunasClient saunas={seattleSaunas} />

        {/* Additional SEO content */}
        <footer className="prose prose-sm max-w-none pt-6 border-t">
          <h2 className="text-lg font-semibold">
            About Seattle&apos;s Sauna Scene
          </h2>
          <p>
            Seattle has embraced the global sauna renaissance, offering a
            diverse range of heat therapy experiences. From the authentic
            Russian banya tradition at Banya 5 in Georgetown to the
            Finnish-inspired Löyly in Ballard, there&apos;s a sauna for every
            preference and budget.
          </p>
          <p>
            Most Seattle saunas offer contrast therapy with cold plunge pools,
            and many provide day passes for drop-in visits. Whether you&apos;re
            seeking a social bathhouse atmosphere or a private wellness
            retreat, this guide helps you compare all your options.
          </p>
        </footer>
      </article>
    </>
  );
}

