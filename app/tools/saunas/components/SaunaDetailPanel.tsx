"use client";

import { type Sauna } from "@/data/saunas/seattle-saunas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg truncate">
          <a 
            href={sauna.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            {sauna.name}
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
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
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Price and Duration */}
        <div className="flex items-center gap-2 flex-wrap">
          {sauna.sessionPrice > 0 && (
            <Badge variant="default" className="text-sm">
              ${sauna.sessionPrice}
            </Badge>
          )}
          {sauna.sessionLengthMinutes && (
            <Badge variant="outline" className="text-sm gap-1">
              <Clock className="h-3 w-3" />
              {sauna.sessionLengthMinutes} min
            </Badge>
          )}
        </div>

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

        {/* Hours */}
        {sauna.hours && (
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
      <div className="p-4 border-t space-y-2">
        <Button asChild className="w-full">
          <a href={sauna.website} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Website
          </a>
        </Button>
        {sauna.bookingUrl && (
          <Button variant="outline" asChild className="w-full">
            <a href={sauna.bookingUrl} target="_blank" rel="noopener noreferrer">
              Book Now
            </a>
          </Button>
        )}
        {sauna.googleMapsUrl && (
          <Button variant="outline" asChild className="w-full">
            <a href={sauna.googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="mr-2 h-4 w-4" />
              Open in Google Maps
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

