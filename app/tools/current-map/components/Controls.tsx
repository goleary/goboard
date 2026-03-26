import React, { useEffect, useState } from "react";
import dateFormat from "dateformat";
import { format } from "date-fns";
import { CalendarIcon, Loader2, PauseIcon, PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

type ControlsProps = {
  dates: Date[];
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  startDate: Date;
  onStartDateChange: (date: Date) => void;
  loading: boolean;
  showCurrents: boolean;
  onShowCurrentsChange: (val: boolean) => void;
  showTides: boolean;
  onShowTidesChange: (val: boolean) => void;
};

const Controls: React.FC<ControlsProps> = ({
  dates,
  sliderValue,
  setSliderValue,
  startDate,
  onStartDateChange,
  loading,
  showCurrents,
  onShowCurrentsChange,
  showTides,
  onShowTidesChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(
      () =>
        setSliderValue((val) => {
          if (val === dates.length - 1) return 0;
          return val + 1;
        }),
      250
    );
    return () => clearInterval(interval);
  }, [dates.length, isPlaying, setSliderValue]);

  return (
    <div className="absolute bottom-10 left-0 right-0 z-[400] mx-auto w-[80%] rounded-lg border bg-background/95 backdrop-blur-sm shadow-lg p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs font-normal shrink-0"
            >
              <CalendarIcon className="size-3.5" />
              {format(startDate, "MMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[500]" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                if (date) {
                  onStartDateChange(date);
                  setCalendarOpen(false);
                }
              }}
              defaultMonth={startDate}
            />
          </PopoverContent>
        </Popover>
        <span className="text-sm text-muted-foreground">
          {dates[sliderValue]
            ? dateFormat(dates[sliderValue], "ddd, mmm dS, h:MM TT")
            : ""}
        </span>
        {loading && (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground shrink-0" />
        )}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <Checkbox
              id="show-currents"
              checked={showCurrents}
              onCheckedChange={(v) => onShowCurrentsChange(v === true)}
            />
            <Label htmlFor="show-currents" className="text-xs cursor-pointer">
              Currents
            </Label>
          </div>
          <div className="flex items-center gap-1.5">
            <Checkbox
              id="show-tides"
              checked={showTides}
              onCheckedChange={(v) => onShowTidesChange(v === true)}
            />
            <Label htmlFor="show-tides" className="text-xs cursor-pointer">
              Tides
            </Label>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={() => setIsPlaying((val) => !val)}
        >
          {isPlaying ? (
            <PauseIcon className="size-4" />
          ) : (
            <PlayIcon className="size-4" />
          )}
        </Button>
        <Slider
          min={0}
          max={dates.length - 1}
          value={[sliderValue]}
          onValueChange={([val]) => setSliderValue(val)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default Controls;
