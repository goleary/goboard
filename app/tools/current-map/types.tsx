export interface CurrentPrediction {
  meanFloodDir: number;
  Bin: string;
  meanEbbDir: number;
  Time: string;
  Depth: string;
  Velocity_Major: number;
}

export type StationWithPrediction = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  source?: "noaa" | "chs";
  referenceStation?: string;
  predictions: CurrentPrediction[];
};

export interface TidePrediction {
  Time: string;
  waterLevel: number;
}

export type TideStationWithPrediction = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  source: "chs-tide" | "noaa-tide";
  predictions: TidePrediction[];
};

export type WaterTempStation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  source: "noaa-temp" | "cioos-temp";
  waterTempF: number;
  measuredAt: string;
  sourceUrl: string;
};
