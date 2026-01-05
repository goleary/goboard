"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
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

const MIN_SHEET_HEIGHT = 200;
const MAX_SHEET_PERCENT = 0.85;

export function SaunasClient({ saunas }: SaunasClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [sheetHeight, setSheetHeight] = useState(MIN_SHEET_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
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
    if (!isDragging || !containerRef.current) return;
    setIsDragging(false);
    
    const containerHeight = containerRef.current.parentElement?.clientHeight || window.innerHeight;
    const maxHeight = containerHeight * MAX_SHEET_PERCENT;
    const midPoint = (MIN_SHEET_HEIGHT + maxHeight) / 2;
    
    // Snap to expanded or collapsed
    if (sheetHeight > midPoint) {
      setSheetHeight(maxHeight);
    } else {
      setSheetHeight(MIN_SHEET_HEIGHT);
    }
  }, [isDragging, sheetHeight]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Mouse handlers (for testing on desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientY);
  }, [handleDragStart]);

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

  const handleSaunaClick = (sauna: Sauna) => {
    // Update URL with sauna slug
    const params = new URLSearchParams(searchParams.toString());
    params.set("sauna", sauna.slug);
    router.push(`/seattle-saunas?${params.toString()}`, { scroll: false });
    // Expand sheet on mobile when selecting a sauna
    const containerHeight = containerRef.current?.parentElement?.clientHeight || window.innerHeight;
    setSheetHeight(containerHeight * MAX_SHEET_PERCENT);
  };

  const handleCloseDetail = () => {
    // Remove sauna from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sauna");
    const queryString = params.toString();
    router.push(queryString ? `/seattle-saunas?${queryString}` : "/seattle-saunas", { scroll: false });
  };

  // Filters component for reuse
  const filtersSection = (
    <div className="px-3 py-2 border-b">
      <h2 className="font-semibold text-base mb-2">Seattle&apos;s Public Saunas</h2>
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
            onSaunaClick={handleSaunaClick} 
            selectedSlug={selectedSlug ?? undefined}
            selectedSauna={selectedSauna}
            isMobile={false}
          />
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
                <SaunaDetailPanel sauna={selectedSauna} />
              </div>
            </>
          ) : (
            <>
              {filtersSection}
              <div className="px-3 py-2 border-b bg-background">
                <p className="text-sm text-muted-foreground">{filteredSaunas.length} saunas</p>
              </div>
              <div className="flex-1 overflow-auto">
                <SaunaTable 
                  saunas={filteredSaunas} 
                  compact 
                  onSaunaClick={handleSaunaClick}
                  selectedSlug={selectedSlug ?? undefined}
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
            onSaunaClick={handleSaunaClick}
            selectedSlug={selectedSlug ?? undefined}
            selectedSauna={selectedSauna}
            isMobile={true}
          />
        </div>

        {/* Bottom sheet - always visible */}
        <div 
          className={`absolute left-0 right-0 bottom-0 z-[1000] bg-background rounded-t-2xl border-t shadow-2xl ${
            isDragging ? "" : "transition-all duration-300"
          }`}
          style={{ height: sheetHeight }}
        >
          {/* Drag handle */}
          <div 
            className="w-full flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            <div className="w-10 h-1 bg-muted-foreground/40 rounded-full" />
          </div>
          
          <div className="flex flex-col h-[calc(100%-40px)] overflow-hidden">
            {selectedSauna ? (
              <>
                <button
                  onClick={handleCloseDetail}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border-b shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to list
                </button>
                <div className="flex-1 overflow-auto">
                  <SaunaDetailPanel sauna={selectedSauna} />
                </div>
              </>
            ) : (
              <>
                {filtersSection}
                <div className="px-3 py-1 border-b shrink-0">
                  <p className="text-sm text-muted-foreground">{filteredSaunas.length} saunas</p>
                </div>
                <div className="flex-1 overflow-auto">
                  <SaunaTable 
                    saunas={filteredSaunas} 
                    compact 
                    onSaunaClick={handleSaunaClick}
                    selectedSlug={selectedSlug ?? undefined}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

