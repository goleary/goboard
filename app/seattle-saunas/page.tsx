import { Metadata } from "next";
import { seattleSaunas, getLatestUpdateDate, getSaunaBySlug } from "@/data/saunas/seattle-saunas";
import { SaunasClient } from "./components/SaunasClient";
import dayjs from "dayjs";

type Props = {
  searchParams: Promise<{ sauna?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { sauna: saunaSlug } = await searchParams;
  
  if (saunaSlug) {
    const sauna = getSaunaBySlug(saunaSlug);
    if (sauna) {
      const title = `${sauna.name} - Seattle Sauna`;
      const description = sauna.notes || 
        `${sauna.name} in Seattle. ${sauna.sessionPrice ? `$${sauna.sessionPrice}` : ""} ${sauna.sessionLengthMinutes ? `for ${sauna.sessionLengthMinutes} minutes` : ""}. ${sauna.coldPlunge ? "Cold plunge available." : ""} ${sauna.steamRoom ? "Steam room available." : ""}`.trim();
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://goleary.com/seattle-saunas?sauna=${sauna.slug}`,
          type: "website",
        },
        alternates: {
          canonical: `https://goleary.com/seattle-saunas?sauna=${sauna.slug}`,
        },
      };
    }
  }

  return {
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
}

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

      {/* Header section - constrained width */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="flex items-baseline justify-between gap-4">
          <h1 className="text-3xl font-bold">Seattle Saunas</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {formattedDate}
          </p>
        </header>
      </div>

      {/* Interactive client component - full width */}
      <SaunasClient saunas={seattleSaunas} />
    </>
  );
}

