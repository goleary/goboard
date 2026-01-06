import { Metadata } from "next";
import { Suspense } from "react";
import { saunas, getSaunaBySlug, formatPrice } from "@/data/saunas/saunas";
import { SaunasClient } from "./components/SaunasClient";

type Props = {
  searchParams: Promise<{ sauna?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { sauna: saunaSlug } = await searchParams;
  
  if (saunaSlug) {
    const sauna = getSaunaBySlug(saunaSlug);
    if (sauna) {
      const title = `${sauna.name} - North American Saunas`;
      const description = sauna.notes || 
        `${sauna.name}. ${sauna.sessionPrice ? formatPrice(sauna) : ""} ${sauna.sessionLengthMinutes ? `for ${sauna.sessionLengthMinutes} minutes` : ""}. ${sauna.coldPlunge ? "Cold plunge available." : ""} ${sauna.steamRoom ? "Steam room available." : ""}`.trim();
      
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
    title: "North American Saunas - Compare Sauna & Bathhouse Options",
    description:
      "Compare saunas and bathhouses across North America by price, amenities, and location. Find the perfect sauna experience with cold plunge, steam rooms, and more.",
    openGraph: {
      title: "North American Saunas - Compare Sauna & Bathhouse Options",
      description:
        "Compare saunas and bathhouses across North America by price, amenities, and location.",
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
    name: "North American Saunas",
    description: "A curated list of saunas and bathhouses across North America",
    numberOfItems: saunas.length,
    itemListElement: saunas.map((sauna, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://goleary.com/tools/saunas?sauna=${sauna.slug}`,
      name: sauna.name,
    })),
  };
}

// North America center coordinates (shifted west to capture West Coast saunas)
const NA_CENTER: [number, number] = [45.0, -115.0];

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
          title="North American Public Saunas"
          basePath="/tools/saunas"
          center={NA_CENTER}
          zoom={4}
        />
      </Suspense>
    </>
  );
}

