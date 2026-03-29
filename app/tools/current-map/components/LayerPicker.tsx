import React from "react";
import { LayersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BASEMAPS, type BasemapId } from "./Map";

type LayerPickerProps = {
  basemap: BasemapId;
  onBasemapChange: (id: BasemapId) => void;
  showSeaMarks: boolean;
  onShowSeaMarksChange: (val: boolean) => void;
};

const LayerPicker: React.FC<LayerPickerProps> = ({
  basemap,
  onBasemapChange,
  showSeaMarks,
  onShowSeaMarksChange,
}) => {
  return (
    <div className="absolute top-3 right-3 z-[400] pointer-events-none [&>*]:pointer-events-auto">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="size-8 bg-background/95 backdrop-blur-sm shadow-lg">
            <LayersIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3 z-[500]" align="end">
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-muted-foreground">Base map</Label>
            {(Object.entries(BASEMAPS) as [BasemapId, (typeof BASEMAPS)[BasemapId]][]).map(
              ([id, { name }]) => (
                <div key={id} className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    id={`basemap-${id}`}
                    name="basemap"
                    checked={basemap === id}
                    onChange={() => onBasemapChange(id)}
                    className="accent-primary"
                  />
                  <Label htmlFor={`basemap-${id}`} className="text-xs cursor-pointer font-normal">
                    {name}
                  </Label>
                </div>
              )
            )}
            <div className="border-t my-1" />
            <Label className="text-xs font-medium text-muted-foreground">Overlay</Label>
            <div className="flex items-center gap-1.5">
              <Checkbox
                id="show-sea-marks"
                checked={showSeaMarks}
                onCheckedChange={(v) => onShowSeaMarksChange(v === true)}
              />
              <Label htmlFor="show-sea-marks" className="text-xs cursor-pointer font-normal">
                Sea Marks
              </Label>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LayerPicker;
