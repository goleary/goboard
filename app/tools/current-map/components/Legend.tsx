import React from "react";
import { InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const LEGEND_COLORS = ["#0d0887", "#7e03a8", "#cc4778", "#f89540"];
export const VELOCITY_BREAK_POINTS = [0, 1, 3, 5];

const LegendContent: React.FC = () => (
  <div className="flex flex-col text-xs">
    <div className="text-sm font-bold text-center pb-1">Current speed</div>
    {LEGEND_COLORS.map((color, i) => (
      <div className="flex items-center gap-2 py-px" key={`current-${i}`}>
        <div
          className="w-3 h-3 shrink-0"
          style={{ backgroundColor: color }}
        />
        <span>
          {i < LEGEND_COLORS.length - 1
            ? `${VELOCITY_BREAK_POINTS[i]}-${VELOCITY_BREAK_POINTS[i + 1]}`
            : `${VELOCITY_BREAK_POINTS[i]}+`}{" "}
          knots
        </span>
      </div>
    ))}
    <div className="border-t border-gray-200 mt-2 pt-1 text-sm font-bold text-center">
      Tide level
    </div>
    <div className="flex items-center gap-2 py-1 text-xs">
      <svg width="24" height="12" viewBox="0 0 24 12">
        <circle cx="6" cy="6" r="5" fill="#d1e5f0" stroke="white" strokeWidth="1" />
        <circle cx="18" cy="6" r="5" fill="#d1e5f0" stroke="white" strokeWidth="1" />
        <clipPath id="legend-fill">
          <rect x="13" y="0" width="10" height="12" />
        </clipPath>
        <circle cx="18" cy="6" r="5" fill="#2166ac" clipPath="url(#legend-fill)" />
      </svg>
      low — high
    </div>
    <div className="border-t border-gray-200 mt-2 pt-1 text-sm font-bold text-center">
      Water temp
    </div>
    {[
      { color: "#3b82f6", label: "< 45°F" },
      { color: "#0ea5e9", label: "45-50°F" },
      { color: "#06b6d4", label: "50-55°F" },
      { color: "#14b8a6", label: "55-60°F" },
      { color: "#22c55e", label: "60-65°F" },
      { color: "#eab308", label: "65-70°F" },
      { color: "#f97316", label: "> 70°F" },
    ].map(({ color, label }) => (
      <div key={label} className="flex items-center gap-2 py-px">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span>{label}</span>
      </div>
    ))}
    <div className="text-xs text-center pt-2">
      built by{" "}
      <a href="/" className="underline whitespace-nowrap">
        {"Gabe O'Leary"}
      </a>
    </div>
  </div>
);

const Legend: React.FC = () => {
  return (
    <>
      {/* Mobile: popover button */}
      <div className="md:hidden absolute top-3 right-12 z-[400] pointer-events-none [&>*]:pointer-events-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-8 bg-background/95 backdrop-blur-sm shadow-lg"
            >
              <InfoIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2 z-[500]" align="end">
            <LegendContent />
          </PopoverContent>
        </Popover>
      </div>
      {/* Desktop: always visible */}
      <div className="hidden md:flex absolute top-[20vh] right-6 z-[400] p-2 border border-gray-400 bg-white rounded-lg max-w-[140px]">
        <LegendContent />
      </div>
    </>
  );
};

export default Legend;
