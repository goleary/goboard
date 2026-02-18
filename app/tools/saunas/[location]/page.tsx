import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { saunas, getSaunaBySlug, locations, getLocationBySlug, formatPrice, describeSaunaAmenities, describeLocationAmenities } from "@/data/saunas/saunas";
import type { Sauna } from "@/data/saunas/saunas";
import { SaunasClient } from "../components/SaunasClient";

type Props = {
  params: Promise<{ location: string }>;
  searchParams: Promise<{ sauna?: string }>;
};

export async function generateStaticParams() {
  return locations.map((location) => ({
    location: location.slug,
  }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { location: locationSlug } = await params;
  const { sauna: saunaSlug } = await searchParams;
  
  const location = getLocationBySlug(locationSlug);
  if (!location) {
    return { title: "Location Not Found" };
  }
  
  if (saunaSlug) {
    const sauna = getSaunaBySlug(saunaSlug);
    if (sauna) {
      const title = `${sauna.name} - ${location.name} Saunas`;
      const amenities = describeSaunaAmenities(sauna);
      const description = sauna.notes ||
        [
          sauna.name,
          sauna.sessionPrice ? `${formatPrice(sauna)}${sauna.sessionLengthMinutes ? ` for ${sauna.sessionLengthMinutes} min` : ""}` : "",
          amenities,
        ].filter(Boolean).join(". ").trim() + ".";
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://goleary.com/tools/saunas/${location.slug}?sauna=${sauna.slug}`,
          type: "website",
        },
        alternates: {
          canonical: `https://goleary.com/tools/saunas/${location.slug}?sauna=${sauna.slug}`,
        },
      };
    }
  }

  const locationSaunas = saunas.filter(() => true);
  const amenitySummary = describeLocationAmenities(locationSaunas);
  const description = `${location.description} ${amenitySummary}`;

  return {
    title: `${location.name} Saunas - Compare Local Sauna & Bathhouse Options`,
    description,
    openGraph: {
      title: `${location.name} Saunas - Compare Local Sauna & Bathhouse Options`,
      description,
      url: `https://goleary.com/tools/saunas/${location.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://goleary.com/tools/saunas/${location.slug}`,
    },
  };
}

function generateSaunaDescription(sauna: Sauna): string {
  const amenities = describeSaunaAmenities(sauna);
  return [
    sauna.sessionPrice ? `${formatPrice(sauna)}${sauna.sessionLengthMinutes ? ` for ${sauna.sessionLengthMinutes} min` : ""}` : "",
    amenities,
  ].filter(Boolean).join(". ");
}

function generateItemListSchema(locationName: string, locationSlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${locationName} Saunas`,
    description: `A curated list of saunas and bathhouses in ${locationName}`,
    numberOfItems: saunas.length,
    itemListElement: saunas.map((sauna, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://goleary.com/tools/saunas/${locationSlug}?sauna=${sauna.slug}`,
      name: sauna.name,
      description: generateSaunaDescription(sauna),
    })),
  };
}

export default async function LocationSaunasPage({ params }: Props) {
  const { location: locationSlug } = await params;
  const location = getLocationBySlug(locationSlug);
  
  if (!location) {
    notFound();
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateItemListSchema(location.name, location.slug)),
        }}
      />

      {/* Interactive client component - full width */}
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
        <SaunasClient 
          saunas={saunas}
          title={`${location.name} Public Saunas`}
          basePath={`/tools/saunas/${location.slug}`}
          center={[location.center.lat, location.center.lng]}
          zoom={location.zoom}
        />
      </Suspense>
    </>
  );
}


