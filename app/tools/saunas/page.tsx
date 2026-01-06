import { Metadata } from "next";
import { Suspense } from "react";
import { saunas, getSaunaBySlug } from "@/data/saunas/seattle-saunas";
import { SaunasClient } from "./components/SaunasClient";

type Props = {
  searchParams: Promise<{ sauna?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { sauna: saunaSlug } = await searchParams;
  
  if (saunaSlug) {
    const sauna = getSaunaBySlug(saunaSlug);
    if (sauna) {
      const title = `${sauna.name} - US Saunas`;
      const description = sauna.notes || 
        `${sauna.name}. ${sauna.sessionPrice ? `$${sauna.sessionPrice}` : ""} ${sauna.sessionLengthMinutes ? `for ${sauna.sessionLengthMinutes} minutes` : ""}. ${sauna.coldPlunge ? "Cold plunge available." : ""} ${sauna.steamRoom ? "Steam room available." : ""}`.trim();
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://goleary.com/tools/saunas?sauna=${sauna.slug}`,
          type: "website",
        },
        alternates: {
          canonical: `https://goleary.com/tools/saunas?sauna=${sauna.slug}`,
        },
      };
    }
  }

  return {
    title: "US Saunas - Compare Sauna & Bathhouse Options",
    description:
      "Compare saunas and bathhouses across the United States by price, amenities, and location. Find the perfect sauna experience with cold plunge, steam rooms, and more.",
    openGraph: {
      title: "US Saunas - Compare Sauna & Bathhouse Options",
      description:
        "Compare saunas and bathhouses across the United States by price, amenities, and location.",
      url: "https://goleary.com/tools/saunas",
      type: "website",
    },
    alternates: {
      canonical: "https://goleary.com/tools/saunas",
    },
  };
}

// Generate schema.org ItemList for SEO
function generateItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "US Saunas",
    description: "A curated list of saunas and bathhouses in the United States",
    numberOfItems: saunas.length,
    itemListElement: saunas.map((sauna, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://goleary.com/tools/saunas?sauna=${sauna.slug}`,
      name: sauna.name,
    })),
  };
}

// US center coordinates (roughly center of continental US)
const US_CENTER: [number, number] = [39.8283, -98.5795];

export default function SaunasPage() {
  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateItemListSchema()),
        }}
      />

      {/* Interactive client component - full width */}
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
        <SaunasClient 
          saunas={saunas}
          title="US Public Saunas"
          basePath="/tools/saunas"
          center={US_CENTER}
          zoom={5}
        />
      </Suspense>
    </>
  );
}

