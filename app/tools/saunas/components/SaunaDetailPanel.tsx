"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { type Sauna, formatPrice } from "@/data/saunas/saunas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SaunaAvailability } from "./SaunaAvailability";
import { SaunaTides } from "./SaunaTides";
import { SaunaWaterTemp } from "./SaunaWaterTemp";
import {
  ExternalLink,
  MapPin,
  Clock,
  Thermometer,
  Snowflake,
  Waves,
  ShowerHead,
  Shirt,
  Leaf,
  Flame,
  FlameKindling,
  Zap,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";

interface SaunaDetailPanelProps {
  sauna: Sauna;
  availabilityDate?: string | null;
  onAvailabilityDateChange?: (date: string | null) => void;
  guests?: number | null;
  onGuestsChange?: (guests: number) => void;
  /** When true, the panel does not create its own scroll container — the parent handles scrolling (e.g. Sheet.Content). */
  disableScroll?: boolean;
}

function AmenityBadge({
  icon: Icon,
  label,
  available,
  iconClassName,
  emoji,
  title,
}: {
  icon?: React.ElementType;
  label: string;
  available: boolean;
  iconClassName?: string;
  emoji?: string;
  title?: string;
}) {
  if (!available) return null;
  return (
    <Badge variant="secondary" className="gap-1" title={title}>
      {emoji ? <span>{emoji}</span> : Icon && <Icon className={`h-3 w-3 ${iconClassName || ""}`} />}
      {label}
    </Badge>
  );
}

export function SaunaDetailPanel({ sauna, availabilityDate, onAvailabilityDateChange, guests, onGuestsChange, disableScroll }: SaunaDetailPanelProps) {
  const [hasAvailability, setHasAvailability] = useState(false);
  const [firstAvailableDate, setFirstAvailableDate] = useState<string | null>(null);
  const [lastAvailableDate, setLastAvailableDate] = useState<string | null>(null);
  const [tideOpen, setTideOpen] = useState(false);
  const [tideHighlightTime, setTideHighlightTime] = useState<string | null>(null);
  const [tideHighlightColor, setTideHighlightColor] = useState<string | null>(null);
  const [tideScrollNonce, setTideScrollNonce] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => {
    setHasAvailability(false);
    setFirstAvailableDate(null);
    setLastAvailableDate(null);
    setTideOpen(false);
    setTideHighlightTime(null);
    setTideHighlightColor(null);
    setImageIndex(0);
  }, [sauna.slug]);

  // Reset tide highlight when the availability date changes
  useEffect(() => {
    setTideHighlightTime(null);
    setTideHighlightColor(null);
  }, [availabilityDate]);

  const handleHasAvailability = useCallback((v: boolean) => setHasAvailability(v), []);
  const handleFirstAvailableDate = useCallback((d: string | null) => setFirstAvailableDate(d), []);
  const handleLastAvailableDate = useCallback((d: string | null) => setLastAvailableDate(d), []);
  const handleTideTimeClick = useCallback((slotTime: string, color: string) => {
    setTideHighlightTime(slotTime);
    setTideHighlightColor(color);
    setTideOpen(true);
    setTideScrollNonce((n) => n + 1);
  }, []);

  return (
    <div className={`flex flex-col min-h-0 ${disableScroll ? "" : "h-full"}`}>
      {/* Scrollable content */}
      <div className={`flex-1 min-h-0 ${disableScroll ? "" : "overflow-auto thin-scrollbar"}`}>
        {/* Images */}
        {sauna.images && sauna.images.length > 0 && (
          <div className="relative">
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={sauna.images[imageIndex].url}
                alt={sauna.images[imageIndex].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            {sauna.images.length > 1 && (
              <>
                <button
                  onClick={() => setImageIndex((i) => (i - 1 + sauna.images!.length) % sauna.images!.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setImageIndex((i) => (i + 1) % sauna.images!.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {sauna.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i)}
                      className={`w-2 h-2 rounded-full ${i === imageIndex ? "bg-white" : "bg-white/50"}`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Header */}
        <div className="p-4">
          <h2 className="font-semibold text-lg">
            <a
              href={sauna.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
              data-umami-event="website-click"
              data-umami-event-sauna={sauna.slug}
            >
              {sauna.name}
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </h2>
          {sauna.address && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{sauna.address}</span>
            </p>
          )}

        </div>

        <div className="px-4 pb-4 space-y-4">
          {/* Price and Duration – hidden when live availability is shown */}
          {!hasAvailability && (
            <div className="flex items-center gap-2 flex-wrap">
              {sauna.sessionPrice > 0 && (
                <Badge variant="default" className="text-sm">
                  {formatPrice(sauna)}
                </Badge>
              )}
              {(sauna.sessionLengthMinutes ?? 0) > 0 && (
                <Badge variant="outline" className="text-sm gap-1">
                  <Clock className="h-3 w-3" />
                  {sauna.sessionLengthMinutes} min
                </Badge>
              )}
            </div>
          )}

          {/* Amenities */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Amenities
            </p>
            <div className="flex flex-wrap gap-1.5">
              <AmenityBadge icon={sauna.heaterType === "wood" ? FlameKindling : sauna.heaterType === "electric" ? Zap : Flame} label="Sauna" available={true} iconClassName="text-orange-500" title={sauna.heaterType === "wood" ? "Wood stove" : sauna.heaterType === "electric" ? "Electric stove" : sauna.heaterType === "gas" ? "Gas stove" : undefined} />
              <AmenityBadge icon={Snowflake} label="Cold Plunge" available={sauna.coldPlunge && !sauna.waterTempProvider && !sauna.isFloating} iconClassName="text-sky-500" />
              <AmenityBadge emoji="♨️" label="Soaking Tub" available={sauna.soakingTub} />
              <SaunaWaterTemp sauna={sauna} />
              {(sauna.isFloating ?? false) && (
                <Badge variant="secondary" className="gap-1">
                  <svg className="h-3 w-3 text-blue-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path fill="currentColor" fillRule="evenodd" d="M12 4 L21 11 H19 V18 H5 V11 H3 Z M10 14 H14 V18 H10 Z" />
                    <path d="M0 21c.65.5 1.3 1 2.7 1 2.7 0 2.7-2 5.4-2 2.8 0 2.6 2 5.4 2 2.7 0 2.7-2 5.4-2 2.7 0 2.7 2 5.1 2" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Floating
                </Badge>
              )}
              <AmenityBadge icon={Waves} label="Waterfront" available={sauna.waterfront && !sauna.naturalPlunge && !sauna.isFloating} iconClassName="text-blue-500" />
              <AmenityBadge icon={Leaf} label="Natural Plunge" available={sauna.naturalPlunge && !sauna.waterTempProvider && !sauna.isFloating} iconClassName="text-green-600" />
              <AmenityBadge icon={Thermometer} label="Steam Room" available={sauna.steamRoom} />
              <AmenityBadge icon={ShowerHead} label="Showers" available={sauna.showers} />
              <AmenityBadge icon={Shirt} label="Towels" available={sauna.towelsIncluded} />
              <AmenityBadge icon={UtensilsCrossed} label="Food" available={sauna.servesFood ?? false} iconClassName="text-amber-600" />
            </div>
          </div>

          {/* Availability */}
          <SaunaAvailability sauna={sauna} availabilityDate={availabilityDate} onAvailabilityDateChange={onAvailabilityDateChange} guests={guests} onGuestsChange={onGuestsChange} onHasAvailability={handleHasAvailability} onFirstAvailableDate={handleFirstAvailableDate} onLastAvailableDate={handleLastAvailableDate} onTideTimeClick={handleTideTimeClick} />

          {/* Tides */}
          <SaunaTides sauna={sauna} date={firstAvailableDate} endDate={lastAvailableDate} open={tideOpen} onOpenChange={setTideOpen} highlightTime={tideHighlightTime} highlightColor={tideHighlightColor} scrollNonce={tideScrollNonce} />

          {/* Temperature */}
          {sauna.temperatureRangeF && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Temperature
              </p>
              <p className="text-sm">
                {sauna.temperatureRangeF.min}°F - {sauna.temperatureRangeF.max}°F
              </p>
            </div>
          )}

          {/* Hours – hidden when live availability is shown */}
          {sauna.hours && !hasAvailability && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Hours
              </p>
              <p className="text-sm">{sauna.hours}</p>
            </div>
          )}

          {/* Policies */}
          {(sauna.genderPolicy || sauna.clothingPolicy) && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Policies
              </p>
              {sauna.genderPolicy && (
                <p className="text-sm">{sauna.genderPolicy}</p>
              )}
              {sauna.clothingPolicy && (
                <p className="text-sm text-muted-foreground">{sauna.clothingPolicy}</p>
              )}
            </div>
          )}

          {/* Notes */}
          {sauna.notes && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                About
              </p>
              <p className="text-sm">{sauna.notes}</p>
            </div>
          )}
          {/* Report link */}
          <a
            href={`mailto:oleary.gabe@gmail.com?subject=${encodeURIComponent(`Sauna Map - Issue with ${sauna.name}`)}&body=${encodeURIComponent(`Hi,\n\nI'd like to report something missing or incorrect about ${sauna.name}.\n\n[Please describe the issue here]\n`)}`}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors p-2 -mx-2 rounded"
          >
            <Mail className="h-3 w-3" />
            <span>Report something missing or incorrect</span>
          </a>
        </div>
      </div>

      {/* Actions – sticky at bottom */}
      {(sauna.bookingUrl || sauna.googleMapsUrl) && (
        <div className="p-4 border-t shrink-0 flex gap-2">
          {sauna.bookingUrl && (
            <Button asChild className="flex-1">
              <a href={sauna.bookingUrl} target="_blank" rel="noopener noreferrer" data-umami-event="book-now-click" data-umami-event-sauna={sauna.slug}>
                Book Now
              </a>
            </Button>
          )}
          {sauna.googleMapsUrl && (
            <Button variant="outline" asChild className="flex-1">
              <a href={sauna.googleMapsUrl} target="_blank" rel="noopener noreferrer" data-umami-event="google-maps-click" data-umami-event-sauna={sauna.slug}>
                <MapPin className="mr-1 h-4 w-4" />
                Google Maps
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

