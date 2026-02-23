"use client";

import { useState, useCallback, useEffect } from "react";
import { type Sauna, formatPrice } from "@/data/saunas/saunas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SaunaAvailability } from "./SaunaAvailability";
import { SaunaTides } from "./SaunaTides";
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
  UtensilsCrossed,
} from "lucide-react";

interface SaunaDetailPanelProps {
  sauna: Sauna;
}

function AmenityBadge({
  icon: Icon,
  label,
  available,
  iconClassName,
  emoji,
}: {
  icon?: React.ElementType;
  label: string;
  available: boolean;
  iconClassName?: string;
  emoji?: string;
}) {
  if (!available) return null;
  return (
    <Badge variant="secondary" className="gap-1">
      {emoji ? <span>{emoji}</span> : Icon && <Icon className={`h-3 w-3 ${iconClassName || ""}`} />}
      {label}
    </Badge>
  );
}

export function SaunaDetailPanel({ sauna }: SaunaDetailPanelProps) {
  const [hasAvailability, setHasAvailability] = useState(false);
  const [firstAvailableDate, setFirstAvailableDate] = useState<string | null>(null);
  const [lastAvailableDate, setLastAvailableDate] = useState<string | null>(null);
  const [tideOpen, setTideOpen] = useState(false);
  const [tideHighlightTime, setTideHighlightTime] = useState<string | null>(null);
  const [tideHighlightColor, setTideHighlightColor] = useState<string | null>(null);
  const [tideScrollNonce, setTideScrollNonce] = useState(0);
  useEffect(() => {
    setHasAvailability(false);
    setFirstAvailableDate(null);
    setLastAvailableDate(null);
    setTideOpen(false);
    setTideHighlightTime(null);
    setTideHighlightColor(null);
  }, [sauna.slug]);

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
    <div className="flex flex-col min-h-0 h-full">
      {/* Header */}
      <div className="p-4 border-b shrink-0">
        <h2 className="font-semibold text-lg truncate">
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
            <span className="truncate">{sauna.address}</span>
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto thin-scrollbar p-4 space-y-4 min-h-0">
        {/* Price and Duration – hidden when live availability is shown */}
        {!hasAvailability && (
          <div className="flex items-center gap-2 flex-wrap">
            {sauna.sessionPrice > 0 && (
              <Badge variant="default" className="text-sm">
                {formatPrice(sauna)}
              </Badge>
            )}
            {sauna.sessionLengthMinutes && (
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
            <AmenityBadge icon={Flame} label="Sauna" available={true} iconClassName="text-orange-500" />
            <AmenityBadge icon={Snowflake} label="Cold Plunge" available={sauna.coldPlunge} iconClassName="text-sky-500" />
            <AmenityBadge emoji="♨️" label="Soaking Tub" available={sauna.soakingTub} />
            <AmenityBadge icon={Waves} label="Waterfront" available={sauna.waterfront} iconClassName="text-blue-500" />
            <AmenityBadge icon={Leaf} label="Natural Plunge" available={sauna.naturalPlunge} iconClassName="text-green-600" />
            <AmenityBadge icon={Thermometer} label="Steam Room" available={sauna.steamRoom} />
            <AmenityBadge icon={ShowerHead} label="Showers" available={sauna.showers} />
            <AmenityBadge icon={Shirt} label="Towels" available={sauna.towelsIncluded} />
            <AmenityBadge icon={UtensilsCrossed} label="Food" available={sauna.servesFood ?? false} iconClassName="text-amber-600" />
          </div>
        </div>

        {/* Availability */}
        <SaunaAvailability sauna={sauna} onHasAvailability={handleHasAvailability} onFirstAvailableDate={handleFirstAvailableDate} onLastAvailableDate={handleLastAvailableDate} onTideTimeClick={handleTideTimeClick} />

        {/* Tides */}
        <SaunaTides sauna={sauna} date={firstAvailableDate} endDate={lastAvailableDate} waitForDate={!!sauna.bookingProvider} open={tideOpen} onOpenChange={setTideOpen} highlightTime={tideHighlightTime} highlightColor={tideHighlightColor} scrollNonce={tideScrollNonce} />

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
      </div>

      {/* Actions */}
      {(sauna.bookingUrl || sauna.googleMapsUrl) && (
        <div className="p-4 border-t flex gap-2">
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

