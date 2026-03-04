"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Mail } from "lucide-react";
import { type Sauna } from "@/data/saunas/saunas";
import {
  SaunaFilters,
  FilterState,
  getDefaultFilters,
  filterAndSortSaunas,
} from "./SaunaFilters";
import { useAvailabilityOn } from "./useAvailabilityOn";
import { SaunaTable } from "./SaunaTable";
import { SaunaDetailPanel } from "./SaunaDetailPanel";
import type { LatLngBounds } from "leaflet";

const AVAILABILITY_ZOOM_THRESHOLD = 8;

// Dynamic import for map (client-only)
const SaunaMap = dynamic(() => import("./SaunaMap"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-full w-full rounded-lg" />
  ),
});

interface SaunasClientProps {
  saunas: Sauna[];
  title: string;
  basePath: string;
  center?: [number, number];
  zoom?: number;
}

const snapPoints = [0, 240, 1];
const COLLAPSED_SNAP = 1;
const EXPANDED_SNAP = 2;

export function SaunasClient({ saunas, title, basePath, center, zoom }: SaunasClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    const dateParam = searchParams.get("date");
    const guestsParam = searchParams.get("guests");
    const defaults = getDefaultFilters();
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      const guests = guestsParam ? parseInt(guestsParam, 10) : null;
      return {
        ...defaults,
        availabilityDate: dateParam,
        guests: guests && guests >= 1 && guests <= 10 ? guests : null,
      };
    }
    return defaults;
  });

  // Sync availabilityDate and guests filter to/from URL query params
  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.availabilityDate) {
      params.set("date", newFilters.availabilityDate);
    } else {
      params.delete("date");
    }
    if (newFilters.guests && newFilters.guests > 1) {
      params.set("guests", String(newFilters.guests));
    } else {
      params.delete("guests");
    }
    const queryString = params.toString();
    router.replace(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false });
  }, [searchParams, basePath, router]);

  const handleAvailabilityDateChange = useCallback((date: string | null) => {
    setFilters((prev) => {
      const newFilters = { ...prev, availabilityDate: date };
      const params = new URLSearchParams(searchParams.toString());
      if (date) {
        params.set("date", date);
      } else {
        params.delete("date");
      }
      if (prev.guests && prev.guests > 1) {
        params.set("guests", String(prev.guests));
      } else {
        params.delete("guests");
      }
      const queryString = params.toString();
      router.replace(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false });
      return newFilters;
    });
  }, [searchParams, basePath, router]);

  const handleGuestsChange = useCallback((guests: number) => {
    setFilters((prev) => {
      const newFilters = { ...prev, guests };
      const params = new URLSearchParams(searchParams.toString());
      if (prev.availabilityDate) {
        params.set("date", prev.availabilityDate);
      }
      if (guests > 1) {
        params.set("guests", String(guests));
      } else {
        params.delete("guests");
      }
      const queryString = params.toString();
      router.replace(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false });
      return newFilters;
    });
  }, [searchParams, basePath, router]);

  // Sync URL back to state on browser back/forward
  useEffect(() => {
    const dateParam = searchParams.get("date");
    const guestsParam = searchParams.get("guests");
    const newDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : null;
    const parsed = guestsParam ? parseInt(guestsParam, 10) : null;
    const newGuests = parsed && parsed >= 1 && parsed <= 20 ? parsed : null;
    setFilters((prev) => {
      if (prev.availabilityDate === newDate && prev.guests === newGuests) return prev;
      return { ...prev, availabilityDate: newDate, guests: newDate ? newGuests : null };
    });
  }, [searchParams]);

  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<SheetRef>(null);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(COLLAPSED_SNAP);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Handle map bounds change
  const handleBoundsChange = useCallback((bounds: LatLngBounds) => {
    setMapBounds(bounds);
  }, []);

  // Handle zoom level change — auto-reset availability filter when zooming out
  const handleZoomChange = useCallback((zoom: number) => {
    setCurrentZoom(zoom);
    if (zoom < AVAILABILITY_ZOOM_THRESHOLD) {
      setFilters((prev) => {
        if (prev.availabilityDate === null) return prev;
        const newFilters = { ...prev, availabilityDate: null, guests: null };
        // Also clear date and guests from URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("date");
        params.delete("guests");
        const queryString = params.toString();
        router.replace(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false });
        return newFilters;
      });
    }
  }, [searchParams, basePath, router]);

  const showAvailabilityFilter = currentZoom >= AVAILABILITY_ZOOM_THRESHOLD;

  // Get selected sauna from URL
  const selectedSlug = searchParams.get("sauna");
  const selectedSauna = useMemo(
    () => saunas.find((s) => s.slug === selectedSlug) || null,
    [saunas, selectedSlug]
  );

  // Track whether to pan/zoom to the selected sauna (only for list selections)
  const [panToSelection, setPanToSelection] = useState(false);

  // Compute initial map center/zoom - if a sauna is pre-selected via URL, focus on it
  const initialCenter = useMemo((): [number, number] => {
    if (selectedSauna) {
      return [selectedSauna.lat, selectedSauna.lng];
    }
    return center || [45.0, -115.0];
  }, [selectedSauna, center]);

  const initialZoom = useMemo(() => {
    if (selectedSauna) {
      return 14; // Zoom in close when viewing a specific sauna
    }
    return zoom || 4;
  }, [selectedSauna, zoom]);

  const filteredSaunas = useMemo(
    () => filterAndSortSaunas(saunas, filters),
    [saunas, filters]
  );

  // Filter saunas by map viewport for the list display
  const viewportSaunas = useMemo(() => {
    if (!mapBounds) return filteredSaunas;
    return filteredSaunas.filter((sauna) =>
      mapBounds.contains([sauna.lat, sauna.lng])
    );
  }, [filteredSaunas, mapBounds]);

  // Availability checking: only check saunas in viewport that have a booking provider
  const checkableSlugs = useMemo(
    () =>
      viewportSaunas
        .filter((s) => s.bookingProvider)
        .map((s) => s.slug),
    [viewportSaunas]
  );

  const { availability, slots, loading: availabilityLoading } = useAvailabilityOn(
    showAvailabilityFilter ? checkableSlugs : [],
    filters.availabilityDate,
    filters.guests
  );

  // Don't apply the filter until we actually have availability data
  const awaitingData =
    checkableSlugs.length > 0 &&
    !checkableSlugs.some((s) => s in availability);

  // Apply availability filter to the full sauna list (for the map)
  // awaitingData: don't filter until initial data arrives (first toggle)
  // After that, stale results from a previous date are kept visible until new data arrives
  const mapSaunas = useMemo(() => {
    if (!filters.availabilityDate || awaitingData) return filteredSaunas;
    return filteredSaunas.filter((sauna) => {
      if (!sauna.bookingProvider) return false;
      if (availability[sauna.slug] === undefined) return true; // not checked (outside viewport)
      return availability[sauna.slug];
    });
  }, [filteredSaunas, filters.availabilityDate, availability, awaitingData]);

  // Apply availability filter to viewport saunas (for the list)
  const displaySaunas = useMemo(() => {
    if (!filters.availabilityDate || awaitingData) return viewportSaunas;
    return viewportSaunas.filter((sauna) => {
      if (!sauna.bookingProvider) return false;
      if (availability[sauna.slug] === undefined) return true; // not checked (outside viewport)
      return availability[sauna.slug];
    });
  }, [viewportSaunas, filters.availabilityDate, availability, awaitingData]);

  // Handler for marker clicks on the map (no pan/zoom)
  const handleMarkerClick = (sauna: Sauna) => {
    // Track map marker click (Leaflet markers aren't DOM elements, so we use umami.track())
    if (typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.track("map-marker-click", { sauna: sauna.slug });
    }
    setPanToSelection(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sauna", sauna.slug);
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
    // Expand sheet on mobile when selecting a sauna
    sheetRef.current?.snapTo(EXPANDED_SNAP);
  };

  // Handler for list item clicks (zoom/pan to sauna)
  const handleListClick = (sauna: Sauna) => {
    setPanToSelection(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sauna", sauna.slug);
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
    // Expand sheet on mobile when selecting a sauna
    sheetRef.current?.snapTo(EXPANDED_SNAP);
  };

  const handleCloseDetail = () => {
    // Remove sauna from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sauna");
    const queryString = params.toString();
    router.push(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false });
  };

  // Filters component for reuse
  const filtersSection = (isMobile: boolean) => (
    <div className={`px-3 pb-2 border-b ${isMobile ? "pt-0" : "pt-2"}`}>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="font-semibold text-lg">{title}</h2>
        <span className="text-sm text-muted-foreground">{displaySaunas.length} in view</span>
      </div>
      <SaunaFilters
        filters={filters}
        onFiltersChange={updateFilters}
        showAvailabilityFilter={showAvailabilityFilter}
        availabilityLoading={availabilityLoading}
      />
    </div>
  );

  return (
    <>
      {/* Desktop: Full-width map with panel overlay */}
      <div className="hidden lg:block relative h-full">
        <div className="absolute inset-0">
          <SaunaMap
            saunas={mapSaunas}
            onSaunaClick={handleMarkerClick}
            onMapClick={selectedSauna ? handleCloseDetail : undefined}
            onBoundsChange={handleBoundsChange}
            onZoomChange={handleZoomChange}
            selectedSlug={selectedSlug ?? undefined}
            selectedSauna={selectedSauna}
            isMobile={false}
            panToSelection={panToSelection}
            center={initialCenter}
            zoom={initialZoom}
          />
        </div>
        <div className="absolute top-4 left-4 bottom-4 w-[340px] z-[1000] bg-background/95 backdrop-blur-sm rounded-lg border shadow-lg overflow-hidden flex flex-col">
          {selectedSauna ? (
            <>
              <button
                type="button"
                onClick={handleCloseDetail}
                className="flex items-center gap-1 p-3 text-sm text-muted-foreground hover:text-foreground border-b"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to list
              </button>
              <div className="flex-1 overflow-hidden">
                <SaunaDetailPanel sauna={selectedSauna} availabilityDate={filters.availabilityDate} onAvailabilityDateChange={handleAvailabilityDateChange} guests={filters.guests} onGuestsChange={handleGuestsChange} />
              </div>
            </>
          ) : (
            <>
              {filtersSection(false)}
              <div className="flex-1 overflow-auto thin-scrollbar">
                <SaunaTable
                  saunas={displaySaunas}
                  compact
                  onSaunaClick={handleListClick}
                  selectedSlug={selectedSlug ?? undefined}
                  isMobile={false}
                  availabilitySlots={filters.availabilityDate ? slots : undefined}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile/Tablet: Full-screen map with bottom sheet */}
      <div className="lg:hidden relative h-full" ref={containerRef}>
        {/* Full-screen map */}
        <div className="absolute inset-0">
          <SaunaMap
            saunas={mapSaunas}
            onSaunaClick={handleMarkerClick}
            onMapClick={selectedSauna ? handleCloseDetail : undefined}
            onBoundsChange={handleBoundsChange}
            onZoomChange={handleZoomChange}
            selectedSlug={selectedSlug ?? undefined}
            selectedSauna={selectedSauna}
            isMobile={true}
            panToSelection={panToSelection}
            center={initialCenter}
            zoom={initialZoom}
          />
        </div>

        {/* Bottom sheet — client-only to avoid hydration mismatch */}
        {mounted && (
          <Sheet
            ref={sheetRef}
            isOpen={true}
            onClose={() => {}}
            disableDismiss
            snapPoints={snapPoints}
            initialSnap={COLLAPSED_SNAP}
            onSnap={setCurrentSnapIndex}
            mountPoint={containerRef.current ?? undefined}
          >
            <Sheet.Container
              style={{
                backgroundColor: "hsl(var(--background))",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
                borderTop: "1px solid hsl(var(--border))",
                boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
              }}
            >
              <Sheet.Header>
                <div className="w-full flex justify-center pt-2 pb-2">
                  <div className="w-10 h-1 bg-muted-foreground/40 rounded-full" />
                </div>
                {selectedSauna ? (
                  <div className="border-b">
                    <button
                      type="button"
                      onClick={handleCloseDetail}
                      className="flex items-center gap-1 px-4 py-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back to list
                    </button>
                  </div>
                ) : (
                  filtersSection(true)
                )}
              </Sheet.Header>
              <Sheet.Content
                disableScroll={(state) => state.currentSnap !== EXPANDED_SNAP}
              >
                <div className="flex flex-col flex-1 min-h-0">
                  {selectedSauna ? (
                    <SaunaDetailPanel sauna={selectedSauna} availabilityDate={filters.availabilityDate} onAvailabilityDateChange={handleAvailabilityDateChange} guests={filters.guests} onGuestsChange={handleGuestsChange} disableScroll />
                  ) : (
                    <>
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1">
                          <SaunaTable
                            saunas={displaySaunas}
                            compact
                            onSaunaClick={handleListClick}
                            selectedSlug={selectedSlug ?? undefined}
                            isMobile={true}
                            availabilitySlots={filters.availabilityDate ? slots : undefined}
                          />
                        </div>
                        {/* Sticky footer - only show when sheet is expanded */}
                        {currentSnapIndex === EXPANDED_SNAP && (
                          <div className="shrink-0 bg-background border-t">
                            <div className="flex items-center justify-between px-3 py-2">
                              <a
                                href="mailto:oleary.gabe@gmail.com?subject=Sauna%20Map%20-%20Missing%20or%20Incorrect%20Info"
                                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors p-2 -mx-2 rounded"
                              >
                                <Mail className="h-3 w-3" />
                                <span>Missing something? Let me know</span>
                              </a>
                              <Link
                                href="/"
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                made by Gabe O&apos;Leary
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Sheet.Content>
            </Sheet.Container>
          </Sheet>
        )}
      </div>
    </>
  );
}
