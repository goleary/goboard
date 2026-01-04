"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Map, TableIcon } from "lucide-react";
import {
  type Sauna,
  getAllNeighborhoods,
} from "@/data/saunas/seattle-saunas";
import {
  SaunaFilters,
  FilterState,
  getDefaultFilters,
  filterAndSortSaunas,
} from "./SaunaFilters";
import { SaunaTable } from "./SaunaTable";

// Dynamic import for map (client-only)
const SaunaMap = dynamic(() => import("./SaunaMap"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-[400px] w-full rounded-lg" />
  ),
});

interface SaunasClientProps {
  saunas: Sauna[];
}

type ViewMode = "table" | "map";

export function SaunasClient({ saunas }: SaunasClientProps) {
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const neighborhoods = useMemo(() => getAllNeighborhoods(), []);
  const filteredSaunas = useMemo(
    () => filterAndSortSaunas(saunas, filters),
    [saunas, filters]
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <SaunaFilters
        neighborhoods={neighborhoods}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSaunas.length} of {saunas.length} saunas
        </p>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <TableIcon className="mr-2 h-4 w-4" />
            Table
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <Map className="mr-2 h-4 w-4" />
            Map
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <SaunaTable saunas={filteredSaunas} />
      ) : (
        <div className="h-[400px] md:h-[500px] rounded-lg overflow-hidden border">
          <SaunaMap saunas={filteredSaunas} />
        </div>
      )}
    </div>
  );
}

