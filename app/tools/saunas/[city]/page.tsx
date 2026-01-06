import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { saunas, getSaunaBySlug, cities, getCityBySlug } from "@/data/saunas/seattle-saunas";
import { SaunasClient } from "../components/SaunasClient";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ sauna?: string }>;
};

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const { sauna: saunaSlug } = await searchParams;
  
  const city = getCityBySlug(citySlug);
  if (!city) {
    return { title: "City Not Found" };
  }
  
  if (saunaSlug) {
    const sauna = getSaunaBySlug(saunaSlug);
    if (sauna) {
      const title = `${sauna.name} - ${city.name} Saunas`;
      const description = sauna.notes || 
        `${sauna.name}. ${sauna.sessionPrice ? `$${sauna.sessionPrice}` : ""} ${sauna.sessionLengthMinutes ? `for ${sauna.sessionLengthMinutes} minutes` : ""}. ${sauna.coldPlunge ? "Cold plunge available." : ""} ${sauna.steamRoom ? "Steam room available." : ""}`.trim();
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://goleary.com/tools/saunas/${city.slug}?sauna=${sauna.slug}`,
          type: "website",
        },
        alternates: {
          canonical: `https://goleary.com/tools/saunas/${city.slug}?sauna=${sauna.slug}`,
        },
      };
    }
  }

  return {
    title: `${city.name} Saunas - Compare Local Sauna & Bathhouse Options`,
    description: city.description,
    openGraph: {
      title: `${city.name} Saunas - Compare Local Sauna & Bathhouse Options`,
      description: city.description,
      url: `https://goleary.com/tools/saunas/${city.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://goleary.com/tools/saunas/${city.slug}`,
    },
  };
}

// Generate schema.org ItemList for SEO
function generateItemListSchema(cityName: string, citySlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cityName} Saunas`,
    description: `A curated list of saunas and bathhouses in ${cityName}`,
    numberOfItems: saunas.length,
    itemListElement: saunas.map((sauna, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://goleary.com/tools/saunas/${citySlug}?sauna=${sauna.slug}`,
      name: sauna.name,
    })),
  };
}

export default async function CitySaunasPage({ params }: Props) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  
  if (!city) {
    notFound();
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateItemListSchema(city.name, city.slug)),
        }}
      />

      {/* Interactive client component - full width */}
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
        <SaunasClient 
          saunas={saunas}
          title={`${city.name} Public Saunas`}
          basePath={`/tools/saunas/${city.slug}`}
          center={[city.center.lat, city.center.lng]}
          zoom={city.zoom}
        />
      </Suspense>
    </>
  );
}

