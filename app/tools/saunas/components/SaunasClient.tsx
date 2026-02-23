"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Mail } from "lucide-react";
import { type Sauna } from "@/data/saunas/saunas";
import {
  SaunaFilters,
  FilterState,
  getDefaultFilters,
  filterAndSortSaunas,
} from "./SaunaFilters";
import { SaunaTable } from "./SaunaTable";
import { SaunaDetailPanel } from "./SaunaDetailPanel";
import type { LatLngBounds } from "leaflet";

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

const MIN_SHEET_HEIGHT = 200;
const MAX_SHEET_PERCENT = 0.85;

// Check if we should allow dragging from this element
function shouldAllowDrag(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return true;
  const element = target as HTMLElement;
  
  // Never allow dragging from buttons, links, or inputs
  if (element.tagName === 'BUTTON' || element.tagName === 'A' || element.tagName === 'INPUT') {
    return false;
  }
  
  // Check if it's inside a scrollable container
  const scrollableParent = element.closest('[class*="overflow-auto"], [class*="overflow-y-auto"], [class*="overflow-scroll"]');
  if (scrollableParent && scrollableParent instanceof HTMLElement) {
    const scrollable = scrollableParent;
    const isScrollable = scrollable.scrollHeight > scrollable.clientHeight;
    const isAtTop = scrollable.scrollTop === 0;
    const isAtBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;
    
    // Allow dragging if:
    // 1. Content is not scrollable, OR
    // 2. User is at the top and dragging down, OR
    // 3. User is at the bottom and dragging up
    // Otherwise, let the scroll happen
    return !isScrollable || isAtTop || isAtBottom;
  }
  
  return true;
}

export function SaunasClient({ saunas, title, basePath, center, zoom }: SaunasClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [sheetHeight, setSheetHeight] = useState(MIN_SHEET_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const isDragGesture = useRef(false);
  const isDraggingRef = useRef(false);
  const hasMoved = useRef(false);
  const touchStartTarget = useRef<EventTarget | null>(null);

  // Handle map bounds change
  const handleBoundsChange = useCallback((bounds: LatLngBounds) => {
    setMapBounds(bounds);
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartY.current = clientY;
    dragStartHeight.current = sheetHeight;
  }, [sheetHeight]);

  // Handle drag move
  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerHeight = containerRef.current.parentElement?.clientHeight || window.innerHeight;
    const maxHeight = containerHeight * MAX_SHEET_PERCENT;
    const deltaY = dragStartY.current - clientY;
    const newHeight = Math.max(MIN_SHEET_HEIGHT, Math.min(maxHeight, dragStartHeight.current + deltaY));
    
    setSheetHeight(newHeight);
  }, [isDragging]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current || !containerRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;
    
    const containerHeight = containerRef.current.parentElement?.clientHeight || window.innerHeight;
    const maxHeight = containerHeight * MAX_SHEET_PERCENT;
    const midPoint = (MIN_SHEET_HEIGHT + maxHeight) / 2;
    
    // Snap to expanded or collapsed
    if (sheetHeight > midPoint) {
      setSheetHeight(maxHeight);
    } else {
      setSheetHeight(MIN_SHEET_HEIGHT);
    }
  }, [sheetHeight]);

  // Handle tap to expand
  const handleTap = useCallback(() => {
    if (!containerRef.current) return;
    
    // Ensure we're not dragging when tapping
    if (isDraggingRef.current) return;
    
    const containerHeight = containerRef.current.parentElement?.clientHeight || window.innerHeight;
    const maxHeight = containerHeight * MAX_SHEET_PERCENT;
    
    // Only expand on tap if currently collapsed
    // Don't collapse on tap - user should use drag handle or back button
    if (sheetHeight <= MIN_SHEET_HEIGHT + 10) {
      setSheetHeight(maxHeight);
    }
  }, [sheetHeight]);



  // Mouse handlers (for testing on desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Don't start dragging if we shouldn't allow drag from this element
    if (!shouldAllowDrag(e.target)) return;
    e.preventDefault();
    handleDragStart(e.clientY);
  }, [handleDragStart]);

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

  // Global mouse handlers for desktop drag
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY);
    };
    
    const handleMouseUp = () => {
      handleDragEnd();
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Global touch handlers for mobile drag - using native listeners with passive: false
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    
    const handleTouchStartNative = (e: TouchEvent) => {
      // Track initial touch position and target
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      touchStartTarget.current = e.target;
      hasMoved.current = false;
      isDragGesture.current = false;
      
      // Don't start dragging if we shouldn't allow drag from this element
      if (!shouldAllowDrag(e.target)) {
        return;
      }
    };
    
    const handleTouchMoveNative = (e: TouchEvent) => {
      // Track that movement occurred
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
      
      if (deltaY > 5 || deltaX > 5) {
        hasMoved.current = true;
      }
      
      // If we're already dragging, prevent default and handle drag
      if (isDraggingRef.current || isDragGesture.current) {
        e.preventDefault();
        if (!isDraggingRef.current) {
          handleDragStart(e.touches[0].clientY);
        } else {
          handleDragMove(e.touches[0].clientY);
        }
        return;
      }
      
      // Need minimum movement to start dragging
      if (deltaY < 10) return;
      
      // If vertical movement is greater than horizontal, check if we should drag
      if (deltaY > deltaX) {
        // Check if we're at the top/bottom of a scrollable container
        const target = e.target;
        if (target && target instanceof Element) {
          const scrollableParent = (target as HTMLElement).closest('[class*="overflow-auto"], [class*="overflow-y-auto"], [class*="overflow-scroll"]');
          if (scrollableParent && scrollableParent instanceof HTMLElement) {
            const scrollable = scrollableParent;
            const isScrollable = scrollable.scrollHeight > scrollable.clientHeight;
            const isAtTop = scrollable.scrollTop === 0;
            const isAtBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;
            const isDraggingDown = e.touches[0].clientY > touchStartY.current;
            const isDraggingUp = e.touches[0].clientY < touchStartY.current;
            
            // Only start dragging if:
            // - Not scrollable, OR
            // - At top and dragging down, OR
            // - At bottom and dragging up
            if (isScrollable && !((isAtTop && isDraggingDown) || (isAtBottom && isDraggingUp))) {
              // Let scrolling happen - don't prevent default
              return;
            }
          }
        }
        
        // Prevent default to stop pull-to-refresh on any vertical swipe within the sheet
        e.preventDefault();
        
        // Check if we should allow drag from this element
        if (!shouldAllowDrag(e.target)) {
          return;
        }
        
        // This is a drag gesture - start dragging
        isDragGesture.current = true;
        handleDragStart(e.touches[0].clientY);
      }
    };
    
    const handleTouchEndNative = () => {
      if (isDraggingRef.current) {
        handleDragEnd();
        isDragGesture.current = false;
        hasMoved.current = false;
        touchStartTarget.current = null;
        return;
      }
      
      // If no drag occurred and no significant movement, treat as tap
      if (!hasMoved.current && !isDragGesture.current && touchStartTarget.current) {
        const target = touchStartTarget.current;
        
        // Check if target is an interactive element or inside one
        if (target instanceof Element) {
          const element = target as HTMLElement;
          const isInteractive = element.closest('button, a, input, label, [role="button"], [role="checkbox"]');
          
          // Only handle tap if not on interactive element and should allow drag
          if (!isInteractive && shouldAllowDrag(target)) {
            // Use requestAnimationFrame to ensure this runs after any click handlers
            requestAnimationFrame(() => {
              handleTap();
            });
          }
        }
      }
      
      isDragGesture.current = false;
      hasMoved.current = false;
      touchStartTarget.current = null;
    };
    
    // Add listeners with passive: false to allow preventDefault when needed
    sheet.addEventListener('touchstart', handleTouchStartNative, { passive: false });
    sheet.addEventListener('touchmove', handleTouchMoveNative, { passive: false });
    sheet.addEventListener('touchend', handleTouchEndNative, { passive: false });
    
    return () => {
      sheet.removeEventListener('touchstart', handleTouchStartNative);
      sheet.removeEventListener('touchmove', handleTouchMoveNative);
      sheet.removeEventListener('touchend', handleTouchEndNative);
    };
  }, [handleDragStart, handleDragMove, handleDragEnd, handleTap]);

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
    const containerHeight = containerRef.current?.parentElement?.clientHeight || window.innerHeight;
    setSheetHeight(containerHeight * MAX_SHEET_PERCENT);
  };

  // Handler for list item clicks (zoom/pan to sauna)
  const handleListClick = (sauna: Sauna) => {
    setPanToSelection(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sauna", sauna.slug);
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
    // Expand sheet on mobile when selecting a sauna
    const containerHeight = containerRef.current?.parentElement?.clientHeight || window.innerHeight;
    setSheetHeight(containerHeight * MAX_SHEET_PERCENT);
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
        <span className="text-sm text-muted-foreground">{viewportSaunas.length} in view</span>
      </div>
      <SaunaFilters
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );

  return (
    <>
      {/* Desktop: Full-width map with panel overlay */}
      <div className="hidden lg:block relative h-full">
        <div className="absolute inset-0">
          <SaunaMap
            saunas={filteredSaunas}
            onSaunaClick={handleMarkerClick}
            onMapClick={selectedSauna ? handleCloseDetail : undefined}
            onBoundsChange={handleBoundsChange}
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
                <SaunaDetailPanel sauna={selectedSauna} />
              </div>
            </>
          ) : (
            <>
              {filtersSection(false)}
              <div className="flex-1 overflow-auto thin-scrollbar">
                <SaunaTable
                  saunas={viewportSaunas}
                  compact
                  onSaunaClick={handleListClick}
                  selectedSlug={selectedSlug ?? undefined}
                  isMobile={false}
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
            saunas={filteredSaunas}
            onSaunaClick={handleMarkerClick}
            onMapClick={selectedSauna ? handleCloseDetail : undefined}
            onBoundsChange={handleBoundsChange}
            selectedSlug={selectedSlug ?? undefined}
            selectedSauna={selectedSauna}
            isMobile={true}
            panToSelection={panToSelection}
            center={initialCenter}
            zoom={initialZoom}
          />
        </div>

        {/* Bottom sheet - always visible */}
        <section 
          ref={sheetRef}
          aria-label="Sauna list panel"
          className={`absolute left-0 right-0 bottom-0 z-[1000] bg-background rounded-t-2xl border-t shadow-2xl flex flex-col ${
            isDragging ? "" : "transition-[height] duration-300 ease-out"
          } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ height: sheetHeight }}
          onMouseDown={handleMouseDown}
        >
          {/* Drag handle */}
          <div 
            className="w-full flex justify-center pt-2 pb-2 touch-none select-none shrink-0"
          >
            <div className="w-10 h-1 bg-muted-foreground/40 rounded-full" />
          </div>
          
          <div className="flex flex-col flex-1 overflow-hidden min-h-0">
            {selectedSauna ? (
              <>
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  className="flex items-center gap-1 px-4 py-1 text-sm text-muted-foreground hover:text-foreground border-b shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to list
                </button>
                <div className="flex-1 overflow-auto min-h-0">
                  <SaunaDetailPanel sauna={selectedSauna} />
                </div>
              </>
            ) : (
              <>
                {filtersSection(true)}
                <div className="flex-1 overflow-auto flex flex-col min-h-0">
                  <div className="flex-1 overflow-auto">
                    <SaunaTable
                      saunas={viewportSaunas}
                      compact
                      onSaunaClick={handleListClick}
                      selectedSlug={selectedSlug ?? undefined}
                      isMobile={true}
                    />
                  </div>
                  {/* Sticky footer - only show when sheet is expanded */}
                  {sheetHeight > MIN_SHEET_HEIGHT && (
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
        </section>
      </div>
    </>
  );
}

