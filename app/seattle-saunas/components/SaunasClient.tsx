"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Map, TableIcon, ChevronLeft } from "lucide-react";
import { type Sauna } from "@/data/saunas/seattle-saunas";
import {
  SaunaFilters,
  FilterState,
  getDefaultFilters,
  filterAndSortSaunas,
} from "./SaunaFilters";
import { SaunaTable } from "./SaunaTable";
import { SaunaDetailPanel } from "./SaunaDetailPanel";

// Dynamic import for map (client-only)
const SaunaMap = dynamic(() => import("./SaunaMap"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-full w-full rounded-lg" />
  ),
});

interface SaunasClientProps {
  saunas: Sauna[];
}

type ViewMode = "table" | "map";

export function SaunasClient({ saunas }: SaunasClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [mobileViewMode, setMobileViewMode] = useState<ViewMode>("table");

  // Get selected sauna from URL
  const selectedSlug = searchParams.get("sauna");
  const selectedSauna = useMemo(
    () => saunas.find((s) => s.slug === selectedSlug) || null,
    [saunas, selectedSlug]
  );

  const filteredSaunas = useMemo(
    () => filterAndSortSaunas(saunas, filters),
    [saunas, filters]
  );

  const handleSaunaClick = (sauna: Sauna) => {
    // Update URL with sauna slug
    const params = new URLSearchParams(searchParams.toString());
    params.set("sauna", sauna.slug);
    router.push(`/seattle-saunas?${params.toString()}`, { scroll: false });
  };

  const handleCloseDetail = () => {
    // Remove sauna from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sauna");
    const queryString = params.toString();
    router.push(queryString ? `/seattle-saunas?${queryString}` : "/seattle-saunas", { scroll: false });
  };

  return (
    <>
      {/* Filters - constrained width */}
      <div className="max-w-4xl mx-auto px-4 pb-4 space-y-4">
        <SaunaFilters
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* Desktop: Full-width map with panel overlay */}
      <div className="hidden lg:block relative h-[calc(100vh-200px)] min-h-[500px]">
        <div className="absolute inset-0">
          <SaunaMap saunas={filteredSaunas} onSaunaClick={handleSaunaClick} />
        </div>
        <div className="absolute top-4 left-4 bottom-4 w-[320px] z-[1000] bg-background/95 backdrop-blur-sm rounded-lg border shadow-lg overflow-hidden flex flex-col">
          {selectedSauna ? (
            <>
              <button
                onClick={handleCloseDetail}
                className="flex items-center gap-1 p-3 text-sm text-muted-foreground hover:text-foreground border-b"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to list
              </button>
              <div className="flex-1 overflow-hidden">
                <SaunaDetailPanel sauna={selectedSauna} onClose={handleCloseDetail} />
              </div>
            </>
          ) : (
            <>
              <div className="p-3 border-b bg-background">
                <p className="text-sm font-medium">{filteredSaunas.length} saunas</p>
              </div>
              <div className="flex-1 overflow-auto">
                <SaunaTable 
                  saunas={filteredSaunas} 
                  compact 
                  onSaunaClick={handleSaunaClick}
                  selectedSlug={selectedSauna?.slug}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile/Tablet: Toggle between views */}
      <div className="lg:hidden px-4 space-y-4">
        <div className="flex gap-2">
          <Button
            variant={mobileViewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setMobileViewMode("table")}
          >
            <TableIcon className="mr-2 h-4 w-4" />
            Table
          </Button>
          <Button
            variant={mobileViewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setMobileViewMode("map")}
          >
            <Map className="mr-2 h-4 w-4" />
            Map
          </Button>
        </div>

        {mobileViewMode === "table" ? (
          <SaunaTable saunas={filteredSaunas} onSaunaClick={handleSaunaClick} />
        ) : (
          <div className="h-[400px] rounded-lg overflow-hidden border">
            <SaunaMap saunas={filteredSaunas} onSaunaClick={handleSaunaClick} />
          </div>
        )}

        {/* Mobile detail modal */}
        {selectedSauna && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-x-4 top-20 bottom-4 bg-background rounded-lg border shadow-lg overflow-hidden">
              <SaunaDetailPanel sauna={selectedSauna} onClose={handleCloseDetail} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

