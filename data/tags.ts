import type { ElementType } from "react";
import {
  Snowflake,
  Waves,
  ShowerHead,
  Shirt,
  Leaf,
  Thermometer,
  UtensilsCrossed,
  FlameKindling,
  Zap,
  Flame,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Tag types
// ---------------------------------------------------------------------------

/** Tags usable by any entity type (sauna, campground, etc.) */
export type SharedTag =
  | "waterfront"
  | "showers"
  | "towels-included"
  | "serves-food"
  | "outside";

/** Tags specific to saunas */
export type SaunaTag =
  | SharedTag
  | "steam-room"
  | "cold-plunge"
  | "soaking-tub"
  | "natural-plunge"
  | "floating"
  | "delivery"
  | "tidal"
  | "wood-fired"
  | "electric-heat"
  | "gas-heat";

// Future:
// export type CampgroundTag =
//   | SharedTag
//   | "fire-pit"
//   | "rv-hookup"
//   | "tent-only"
//   | "lake-access"
//   | ...;

// ---------------------------------------------------------------------------
// Tag metadata for display
// ---------------------------------------------------------------------------

export interface TagMeta {
  /** Display label for badges and filters */
  label: string;
  /** Lucide icon component */
  icon?: ElementType;
  /** Emoji to display instead of icon */
  emoji?: string;
  /** CSS class for icon color in badges */
  iconClassName?: string;
  /** Whether this tag appears in the filter bar */
  filterable?: boolean;
  /** Filter checkbox label (when different from badge label) */
  filterLabel?: string;
  /** Tags whose presence suppresses this tag's badge */
  suppressedBy?: SaunaTag[];
  /** Also suppress badge when waterTempProvider is set */
  suppressedByWaterTemp?: boolean;
  /** Priority for map marker icon cascade (lower = higher priority). undefined = not a marker driver. */
  markerPriority?: number;
  /** Map pin color when this tag drives the marker */
  markerColor?: string;
}

/** Display metadata for every sauna tag. */
export const SAUNA_TAG_META: Record<SaunaTag, TagMeta> = {
  "wood-fired": {
    label: "Wood Stove",
    icon: FlameKindling,
    iconClassName: "text-orange-500",
    filterable: true,
  },
  "electric-heat": {
    label: "Electric Stove",
    icon: Zap,
    iconClassName: "text-orange-500",
  },
  "gas-heat": {
    label: "Gas Stove",
    icon: Flame,
    iconClassName: "text-orange-500",
  },
  "cold-plunge": {
    label: "Cold Plunge",
    icon: Snowflake,
    iconClassName: "text-sky-500",
    filterable: true,
    suppressedBy: ["floating"],
    suppressedByWaterTemp: true,
    markerPriority: 50,
    markerColor: "#5FA8FF",
  },
  "soaking-tub": {
    label: "Soaking Tub",
    emoji: "♨️",
    filterable: true,
    markerPriority: 40,
    markerColor: "#E65A3A",
  },
  waterfront: {
    label: "Waterfront",
    icon: Waves,
    iconClassName: "text-blue-500",
    filterable: true,
    suppressedBy: ["natural-plunge", "floating"],
    markerPriority: 60,
    markerColor: "#E65A3A",
  },
  "natural-plunge": {
    label: "Natural Plunge",
    icon: Leaf,
    iconClassName: "text-green-600",
    filterable: true,
    suppressedBy: ["floating"],
    suppressedByWaterTemp: true,
    markerPriority: 20,
    markerColor: "#1A73E8",
  },
  floating: {
    label: "Floating",
    // Uses custom SVG — handled specially in badge and marker rendering
    markerPriority: 10,
    markerColor: "#1A73E8",
  },
  delivery: {
    label: "Mobile Delivery",
    markerPriority: 15,
    markerColor: "#E65A3A",
  },
  "steam-room": {
    label: "Steam Room",
    icon: Thermometer,
  },
  showers: {
    label: "Showers",
    icon: ShowerHead,
  },
  "towels-included": {
    label: "Towels",
    icon: Shirt,
  },
  "serves-food": {
    label: "Food",
    icon: UtensilsCrossed,
    iconClassName: "text-amber-600",
  },
  outside: {
    label: "Outdoor",
  },
  tidal: {
    label: "Tidal",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check if a sauna (or any entity with tags) has a specific tag. */
export function hasTag<T extends string>(
  entity: { tags: T[] },
  tag: T,
): boolean {
  return entity.tags.includes(tag);
}

/** Check if a tag's badge should be displayed, respecting suppression rules. */
export function shouldShowBadge(
  tag: SaunaTag,
  allTags: SaunaTag[],
  hasWaterTempProvider: boolean,
): boolean {
  const meta = SAUNA_TAG_META[tag];
  if (meta.suppressedBy?.some((t) => allTags.includes(t))) return false;
  if (meta.suppressedByWaterTemp && hasWaterTempProvider) return false;
  return true;
}
