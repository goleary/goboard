"use client";

import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { type Sauna } from "@/data/saunas/saunas";

export interface FilterState {
  coldPlungeOnly: boolean;
  soakingTubOnly: boolean;
  waterfrontOnly: boolean;
  naturalPlungeOnly: boolean;
}

interface SaunaFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function getDefaultFilters(): FilterState {
  return {
    coldPlungeOnly: false,
    soakingTubOnly: false,
    waterfrontOnly: false,
    naturalPlungeOnly: false,
  };
}

export function filterAndSortSaunas(
  saunas: Sauna[],
  filters: FilterState
): Sauna[] {
  let filtered = [...saunas];

  // Boolean filters
  if (filters.coldPlungeOnly) {
    filtered = filtered.filter((s) => s.coldPlunge);
  }
  if (filters.soakingTubOnly) {
    filtered = filtered.filter((s) => s.soakingTub);
  }
  if (filters.waterfrontOnly) {
    filtered = filtered.filter((s) => s.waterfront);
  }
  if (filters.naturalPlungeOnly) {
    filtered = filtered.filter((s) => s.naturalPlunge);
  }

  // Sort by price ascending, saunas without price go to bottom
  filtered.sort((a, b) => {
    const aHasPrice = a.sessionPrice > 0;
    const bHasPrice = b.sessionPrice > 0;
    if (aHasPrice && !bHasPrice) return -1;
    if (!aHasPrice && bHasPrice) return 1;
    return (a.sessionPrice ?? 0) - (b.sessionPrice ?? 0);
  });

  return filtered;
}

export function SaunaFilters({
  filters,
  onFiltersChange,
}: SaunaFiltersProps) {
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <Checkbox
          id="coldPlunge"
          checked={filters.coldPlungeOnly}
          onCheckedChange={(v) => updateFilter("coldPlungeOnly", v === true)}
        />
        <Label htmlFor="coldPlunge" className="text-sm cursor-pointer">
          Cold Plunge
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="soakingTub"
          checked={filters.soakingTubOnly}
          onCheckedChange={(v) => updateFilter("soakingTubOnly", v === true)}
        />
        <Label htmlFor="soakingTub" className="text-sm cursor-pointer">
          Soaking Tub
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="waterfront"
          checked={filters.waterfrontOnly}
          onCheckedChange={(v) => updateFilter("waterfrontOnly", v === true)}
        />
        <Label htmlFor="waterfront" className="text-sm cursor-pointer">
          Waterfront
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="naturalPlunge"
          checked={filters.naturalPlungeOnly}
          onCheckedChange={(v) => updateFilter("naturalPlungeOnly", v === true)}
        />
        <Label htmlFor="naturalPlunge" className="text-sm cursor-pointer">
          Natural Plunge
        </Label>
      </div>
    </div>
  );
}

