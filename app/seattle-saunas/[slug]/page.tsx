import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  seattleSaunas,
  getSaunaBySlug,
  getSimilarSaunas,
  type Sauna,
} from "@/data/saunas/seattle-saunas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Thermometer,
  Droplets,
  Waves,
  ShowerHead,
  Shirt,
  Users,
  Clock,
  MapPin,
  ExternalLink,
  CalendarCheck,
  ChevronRight,
  Home,
  Check,
  X,
} from "lucide-react";
import { SaunaLocationMap } from "../components/SaunaLocationMap";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return seattleSaunas.map((sauna) => ({
    slug: sauna.slug,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const sauna = getSaunaBySlug(slug);

  if (!sauna) {
    return {
      title: "Sauna Not Found",
    };
  }

  const description = `${sauna.name} in Seattle.${
    sauna.sessionPrice ? ` $${sauna.sessionPrice}/session.` : ""
  } ${sauna.coldPlunge ? "Features cold plunge." : ""} ${
    sauna.steamRoom ? "Includes steam room." : ""
  }`.trim();

  return {
    title: `${sauna.name} - Seattle Sauna`,
    description: description.trim(),
    openGraph: {
      title: `${sauna.name} - Seattle Sauna`,
      description: description.trim(),
      url: `https://goleary.com/seattle-saunas/${sauna.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://goleary.com/seattle-saunas/${sauna.slug}`,
    },
  };
}

// Generate schema.org LocalBusiness
function generateLocalBusinessSchema(sauna: Sauna) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: sauna.name,
    url: sauna.website,
    ...(sauna.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: sauna.address,
        addressLocality: "Seattle",
        addressRegion: "WA",
        addressCountry: "US",
      },
    }),
    geo: {
      "@type": "GeoCoordinates",
      latitude: sauna.lat,
      longitude: sauna.lng,
    },
    ...(sauna.hours && { openingHours: sauna.hours }),
    ...(sauna.sessionPrice && { priceRange: `$${sauna.sessionPrice}` }),
  };

  return schema;
}

interface AmenityItemProps {
  icon: React.ReactNode;
  label: string;
  available: boolean;
  detail?: string;
}

function AmenityItem({ icon, label, available, detail }: AmenityItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg ${
        available ? "bg-green-50" : "bg-muted/30"
      }`}
    >
      <div
        className={`${
          available ? "text-green-600" : "text-muted-foreground/50"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p
          className={`font-medium ${
            available ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
        {detail && available && (
          <p className="text-sm text-muted-foreground">{detail}</p>
        )}
      </div>
      {available ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground/50" />
      )}
    </div>
  );
}

export default async function SaunaDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const sauna = getSaunaBySlug(slug);

  if (!sauna) {
    notFound();
  }

  const similarSaunas = getSimilarSaunas(slug, 5);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateLocalBusinessSchema(sauna)),
        }}
      />

      <article className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/seattle-saunas" className="hover:text-foreground">
            Seattle Saunas
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">{sauna.name}</span>
        </nav>

        {/* Header */}
        <header>
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <h1 className="text-3xl font-bold">{sauna.name}</h1>
{sauna.sessionPrice > 0 && (
              <Badge variant="outline" className="text-base">
                ${sauna.sessionPrice}
              </Badge>
            )}
          </div>
          {sauna.address && (
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {sauna.address}
            </p>
          )}
        </header>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href={sauna.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </a>
          </Button>
          {sauna.bookingUrl && (
            <Button variant="outline" asChild>
              <a
                href={sauna.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                Book Now
              </a>
            </Button>
          )}
        </div>

        <Separator />

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Amenities Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <AmenityItem
                icon={<Thermometer className="h-5 w-5" />}
                label="Sauna"
                available={true}
                detail={
                  sauna.temperatureRangeF
                    ? `${sauna.temperatureRangeF.min}°F - ${sauna.temperatureRangeF.max}°F`
                    : undefined
                }
              />
              <AmenityItem
                icon={<Droplets className="h-5 w-5" />}
                label="Cold Plunge"
                available={sauna.coldPlunge}
              />
              <AmenityItem
                icon={<Waves className="h-5 w-5" />}
                label="Steam Room"
                available={sauna.steamRoom}
              />
              <AmenityItem
                icon={<ShowerHead className="h-5 w-5" />}
                label="Showers"
                available={sauna.showers}
              />
              <AmenityItem
                icon={<Shirt className="h-5 w-5" />}
                label="Towels Included"
                available={sauna.towelsIncluded}
              />
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                {sauna.sessionPrice > 0 && (
                  <Badge variant="secondary">${sauna.sessionPrice}/session</Badge>
                )}
              </div>

              {sauna.hours && (
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    Hours
                  </h4>
                  <p className="text-sm text-muted-foreground">{sauna.hours}</p>
                </div>
              )}

              {sauna.address && (
                <div>
                  <h4 className="font-medium flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4" />
                    Address
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {sauna.address}
                  </p>
                </div>
              )}

              {sauna.genderPolicy && (
                <div>
                  <h4 className="font-medium mb-1">Gender Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    {sauna.genderPolicy}
                  </p>
                </div>
              )}

              {sauna.clothingPolicy && (
                <div>
                  <h4 className="font-medium mb-1">Clothing Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    {sauna.clothingPolicy}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        {sauna.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About {sauna.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{sauna.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Location Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
            {sauna.address && (
              <CardDescription>{sauna.address}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <SaunaLocationMap sauna={sauna} />
          </CardContent>
        </Card>

        {/* Similar Saunas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Similar Saunas</CardTitle>
            <CardDescription>
              Other saunas you might be interested in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {similarSaunas.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/seattle-saunas/${s.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium">{s.name}</p>
                      {s.sessionPrice > 0 && (
                        <p className="text-sm text-muted-foreground">
                          ${s.sessionPrice}/session
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="pt-4">
          <Link
            href="/seattle-saunas"
            className="text-primary hover:underline flex items-center gap-2"
          >
            ← Back to all Seattle saunas
          </Link>
        </div>
      </article>
    </>
  );
}

