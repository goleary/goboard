"use client";

import { useCallback, useState } from "react";
import { CalendarIcon, Loader2, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { type Sauna } from "@/data/saunas/saunas";

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateButton(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateStr === localDateStr(today)) return "Today";
  if (dateStr === localDateStr(tomorrow)) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export interface FilterState {
  coldPlungeOnly: boolean;
  soakingTubOnly: boolean;
  waterfrontOnly: boolean;
  naturalPlungeOnly: boolean;
  availabilityDate: string | null;
}

interface SaunaFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  showAvailabilityFilter?: boolean;
  availabilityLoading?: boolean;
}

export function getDefaultFilters(): FilterState {
  return {
    coldPlungeOnly: false,
    soakingTubOnly: false,
    waterfrontOnly: false,
    naturalPlungeOnly: false,
    availabilityDate: null,
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
  showAvailabilityFilter = false,
  availabilityLoading = false,
}: SaunaFiltersProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const today = new Date();
  const todayStr = localDateStr(today);

  const handleAvailabilityToggle = useCallback(
    (checked: boolean) => {
      onFiltersChange({
        ...filters,
        availabilityDate: checked ? todayStr : null,
      });
    },
    [filters, onFiltersChange, todayStr]
  );

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        onFiltersChange({
          ...filters,
          availabilityDate: localDateStr(date),
        });
        setCalendarOpen(false);
      }
    },
    [filters, onFiltersChange]
  );

  const selectedDate = filters.availabilityDate
    ? new Date(filters.availabilityDate + "T00:00:00")
    : undefined;

  return (
    <div className="space-y-2">
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

      {showAvailabilityFilter && (
        <>
          <Separator />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="availability"
                checked={filters.availabilityDate !== null}
                onCheckedChange={(v) => handleAvailabilityToggle(v === true)}
              />
              <Label htmlFor="availability" className="text-sm cursor-pointer">
                Has Availability
              </Label>
            </div>

            {filters.availabilityDate !== null && (
              <>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-xs"
                    >
                      <CalendarIcon className="h-3 w-3" />
                      {formatDateButton(filters.availabilityDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={{ before: today }}
                      defaultMonth={selectedDate}
                    />
                  </PopoverContent>
                </Popover>

                {availabilityLoading && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
