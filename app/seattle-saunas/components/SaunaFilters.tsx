"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, ArrowUpDown, Search } from "lucide-react";
import { type Sauna } from "@/data/saunas/seattle-saunas";

export type SortOption = "name" | "neighborhood" | "price-asc" | "price-desc";

export interface FilterState {
  search: string;
  neighborhood: string;
  dayPassOnly: boolean;
  privateRoomOnly: boolean;
  coldPlungeOnly: boolean;
  sortBy: SortOption;
}

interface SaunaFiltersProps {
  neighborhoods: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name", label: "Name (A-Z)" },
  { value: "neighborhood", label: "Neighborhood" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

const PRICE_ORDER = { $: 1, $$: 2, $$$: 3 };

export function getDefaultFilters(): FilterState {
  return {
    search: "",
    neighborhood: "",
    dayPassOnly: false,
    privateRoomOnly: false,
    coldPlungeOnly: false,
    sortBy: "name",
  };
}

export function filterAndSortSaunas(
  saunas: Sauna[],
  filters: FilterState
): Sauna[] {
  let filtered = [...saunas];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.neighborhood.toLowerCase().includes(searchLower)
    );
  }

  // Neighborhood filter
  if (filters.neighborhood) {
    filtered = filtered.filter((s) => s.neighborhood === filters.neighborhood);
  }

  // Boolean filters
  if (filters.dayPassOnly) {
    filtered = filtered.filter((s) => s.dayPassAvailable);
  }
  if (filters.privateRoomOnly) {
    filtered = filtered.filter((s) => s.privateRoomAvailable);
  }
  if (filters.coldPlungeOnly) {
    filtered = filtered.filter((s) => s.coldPlunge);
  }

  // Sort
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "neighborhood":
        return a.neighborhood.localeCompare(b.neighborhood);
      case "price-asc":
        return PRICE_ORDER[a.priceRange] - PRICE_ORDER[b.priceRange];
      case "price-desc":
        return PRICE_ORDER[b.priceRange] - PRICE_ORDER[a.priceRange];
      default:
        return 0;
    }
  });

  return filtered;
}

export function SaunaFilters({
  neighborhoods,
  filters,
  onFiltersChange,
}: SaunaFiltersProps) {
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const clearAllFilters = useCallback(() => {
    onFiltersChange(getDefaultFilters());
  }, [onFiltersChange]);

  const activeFilters: { key: keyof FilterState; label: string }[] = [];
  if (filters.search) activeFilters.push({ key: "search", label: `"${filters.search}"` });
  if (filters.neighborhood)
    activeFilters.push({ key: "neighborhood", label: filters.neighborhood });
  if (filters.dayPassOnly)
    activeFilters.push({ key: "dayPassOnly", label: "Day Pass" });
  if (filters.privateRoomOnly)
    activeFilters.push({ key: "privateRoomOnly", label: "Private Room" });
  if (filters.coldPlungeOnly)
    activeFilters.push({ key: "coldPlungeOnly", label: "Cold Plunge" });

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label || "Sort";

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or neighborhood..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.neighborhood || "all"}
          onValueChange={(v) => updateFilter("neighborhood", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Neighborhood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Neighborhoods</SelectItem>
            {neighborhoods.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {currentSortLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => updateFilter("sortBy", option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Toggle Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Switch
            id="dayPass"
            checked={filters.dayPassOnly}
            onCheckedChange={(v) => updateFilter("dayPassOnly", v)}
          />
          <Label htmlFor="dayPass" className="text-sm cursor-pointer">
            Day Pass Available
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="privateRoom"
            checked={filters.privateRoomOnly}
            onCheckedChange={(v) => updateFilter("privateRoomOnly", v)}
          />
          <Label htmlFor="privateRoom" className="text-sm cursor-pointer">
            Private Rooms
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="coldPlunge"
            checked={filters.coldPlungeOnly}
            onCheckedChange={(v) => updateFilter("coldPlungeOnly", v)}
          />
          <Label htmlFor="coldPlunge" className="text-sm cursor-pointer">
            Cold Plunge
          </Label>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map(({ key, label }) => (
            <Badge
              key={key}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => {
                if (key === "search" || key === "neighborhood") {
                  updateFilter(key, "");
                } else {
                  updateFilter(key as keyof FilterState, false as FilterState[keyof FilterState]);
                }
              }}
            >
              {label}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

