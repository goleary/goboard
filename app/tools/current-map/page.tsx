"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import dateFormat from "dateformat";

import { StationWithPrediction, TideStationWithPrediction, WaterTempStation } from "./types";
import Controls from "./components/Controls";
const LayerPicker = dynamic(() => import("./components/LayerPicker"), {
  ssr: false,
});
import Legend from "./components/Legend";
import Title from "./components/Title";
import dynamic from "next/dynamic";
import type { Bounds, BasemapId } from "./components/Map";

const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
});
const StationMarker = dynamic(() => import("./components/StationMarker"), {
  ssr: false,
});
const TideMarker = dynamic(() => import("./components/TideMarker"), {
  ssr: false,
});
const WaterTempMarker = dynamic(() => import("./components/WaterTempMarker"), {
  ssr: false,
});

function App() {
  const [allStations, setAllStations] = useState<StationWithPrediction[]>([]);
  const [allTideStations, setAllTideStations] = useState<
    TideStationWithPrediction[]
  >([]);

  const [sliderValue, setSliderValue] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [showCurrents, setShowCurrents] = useState(true);
  const [showTides, setShowTides] = useState(true);
  const [basemap, setBasemap] = useState<BasemapId>("voyager");
  const [showSeaMarks, setShowSeaMarks] = useState(false);
  const [allWaterTempStations, setAllWaterTempStations] = useState<WaterTempStation[]>([]);
  const [showWaterTemp, setShowWaterTemp] = useState(true);

  // Initialize start date on client only to avoid hydration mismatch
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateStr = params.get("start");
    if (dateStr) {
      const parsed = new Date(dateStr + "T00:00:00");
      if (!isNaN(parsed.getTime())) {
        setStartDate(parsed);
        return;
      }
    }
    setStartDate(new Date());
  }, []);

  const fetchStationData = useCallback(async (start: Date) => {
    setLoading(true);
    const threeDaysLater = new Date(
      start.getTime() + 3 * 24 * 60 * 60 * 1000
    );
    const mask = "yyyymmdd";
    const params = new URLSearchParams({
      begin_date: dateFormat(start, mask),
      end_date: dateFormat(threeDaysLater, mask),
      interval: "30",
    });

    const [noaaResponse, chsResponse, chsTideResponse, noaaTideResponse] =
      await Promise.all([
        fetch("/api/predictions?" + params.toString()),
        fetch("/api/predictions/chs?" + params.toString()),
        fetch("/api/predictions/chs-tides?" + params.toString()),
        fetch("/api/predictions/noaa-tides?" + params.toString()),
      ]);

    const noaaStations =
      (await noaaResponse.json()) as StationWithPrediction[];
    const chsStations =
      (await chsResponse.json()) as StationWithPrediction[];
    const chsTideStations =
      (await chsTideResponse.json()) as TideStationWithPrediction[];
    const noaaTideStations =
      (await noaaTideResponse.json()) as TideStationWithPrediction[];

    const allCurrentStations = [...noaaStations, ...chsStations];
    setAllStations(allCurrentStations);
    setAllTideStations([...chsTideStations, ...noaaTideStations]);

    if (allCurrentStations.length > 0) {
      setDates(
        allCurrentStations[0].predictions.map(({ Time }) => new Date(Time))
      );
    }
    setSliderValue(0);
    setLoading(false);
  }, []);

  // Fetch when startDate changes
  useEffect(() => {
    if (!startDate) return;

    // Only persist start date in URL if it's not today
    const params = new URLSearchParams(window.location.search);
    const today = dateFormat(new Date(), "yyyy-mm-dd");
    const selected = dateFormat(startDate, "yyyy-mm-dd");
    if (selected !== today) {
      params.set("start", selected);
    } else {
      params.delete("start");
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);

    fetchStationData(startDate);
  }, [startDate, fetchStationData]);

  // Fetch water temperature once on mount (real-time, independent of date/time slider)
  useEffect(() => {
    async function fetchWaterTemp() {
      const [noaaRes, cioosRes] = await Promise.all([
        fetch("/api/predictions/noaa-water-temp"),
        fetch("/api/predictions/cioos-water-temp"),
      ]);
      const noaaStations = (await noaaRes.json()) as WaterTempStation[];
      const cioosStations = (await cioosRes.json()) as WaterTempStation[];
      setAllWaterTempStations([...noaaStations, ...cioosStations]);
    }
    fetchWaterTemp();
  }, []);

  // Filter stations by viewport bounds client-side
  const stations = useMemo(() => {
    if (!bounds) return allStations;
    return allStations.filter(
      (s) => s.lat >= bounds.south && s.lat <= bounds.north &&
             s.lng >= bounds.west && s.lng <= bounds.east
    );
  }, [allStations, bounds]);

  const tideStations = useMemo(() => {
    if (!bounds) return allTideStations;
    return allTideStations.filter(
      (s) => s.lat >= bounds.south && s.lat <= bounds.north &&
             s.lng >= bounds.west && s.lng <= bounds.east
    );
  }, [allTideStations, bounds]);

  // Map from raw NOAA station ID to water temp for co-located tide stations
  const waterTempByStationId = useMemo(() => {
    const lookup = new globalThis.Map<string, number>();
    for (const s of allWaterTempStations) {
      if (s.source === "noaa-temp") {
        lookup.set(s.id.replace("noaa-temp-", ""), s.waterTempF);
      }
    }
    return lookup;
  }, [allWaterTempStations]);

  // IDs of tide stations that have co-located temp data
  const tideStationTempIds = useMemo(() => {
    const ids = new Set<string>();
    for (const s of allTideStations) {
      if (s.source === "noaa-tide") {
        const rawId = s.id.replace("noaa-tide-", "");
        if (waterTempByStationId.has(rawId)) ids.add(rawId);
      }
    }
    return ids;
  }, [allTideStations, waterTempByStationId]);

  // Standalone temp stations (not co-located with a tide station)
  const waterTempStations = useMemo(() => {
    const filtered = allWaterTempStations.filter((s) => {
      if (s.source === "noaa-temp") {
        const rawId = s.id.replace("noaa-temp-", "");
        return !tideStationTempIds.has(rawId);
      }
      return true;
    });
    if (!bounds) return filtered;
    return filtered.filter(
      (s) => s.lat >= bounds.south && s.lat <= bounds.north &&
             s.lng >= bounds.west && s.lng <= bounds.east
    );
  }, [allWaterTempStations, tideStationTempIds, bounds]);

  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <Map onBoundsChange={setBounds} basemap={basemap} showSeaMarks={showSeaMarks}>
        {showCurrents && stations.map((s) => (
          <StationMarker key={s.id} {...s} index={sliderValue} />
        ))}
        {showTides && tideStations.map((s) => {
          const rawId = s.source === "noaa-tide" ? s.id.replace("noaa-tide-", "") : undefined;
          const tempF = rawId ? waterTempByStationId.get(rawId) : undefined;
          return (
            <TideMarker key={s.id} {...s} index={sliderValue} waterTempF={showWaterTemp ? tempF : undefined} />
          );
        })}
        {showWaterTemp && waterTempStations.map((s) => (
          <WaterTempMarker key={s.id} {...s} />
        ))}
      </Map>
      <Title />
      <LayerPicker
        basemap={basemap}
        onBasemapChange={setBasemap}
        showSeaMarks={showSeaMarks}
        onShowSeaMarksChange={setShowSeaMarks}
      />
      <Legend />
      {startDate && (
        <Controls
          dates={dates}
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          startDate={startDate}
          onStartDateChange={setStartDate}
          loading={loading}
          showCurrents={showCurrents}
          onShowCurrentsChange={setShowCurrents}
          showTides={showTides}
          onShowTidesChange={setShowTides}
          showWaterTemp={showWaterTemp}
          onShowWaterTempChange={setShowWaterTemp}
        />
      )}
    </div>
  );
}

export default App;
