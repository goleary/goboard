"use client";
import React, { useEffect, useState } from "react";

import dateFormat from "dateformat";

import { StationWithPrediction, TideStationWithPrediction } from "./types";
import Controls from "./components/Controls";
import Legend from "./components/Legend";
import Title from "./components/Title";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
});
const StationMarker = dynamic(() => import("./components/StationMarker"), {
  ssr: false,
});
const TideMarker = dynamic(() => import("./components/TideMarker"), {
  ssr: false,
});
function App() {
  const [stations, setStations] = useState<StationWithPrediction[]>([]);
  const [tideStations, setTideStations] = useState<
    TideStationWithPrediction[]
  >([]);

  const [sliderValue, setSliderValue] = useState(0);

  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const fetchStationData = async () => {
      const now = new Date();
      const threeDaysInTheFuture = new Date(
        now.getTime() + 3 * 24 * 60 * 60 * 1000
      );
      const mask = "yyyymmdd";
      const params = new URLSearchParams({
        begin_date: dateFormat(now, mask),
        end_date: dateFormat(threeDaysInTheFuture, mask),
        interval: "30",
      });

      const [noaaResponse, chsResponse, tideResponse] = await Promise.all([
        fetch("/api/predictions?" + params.toString()),
        fetch("/api/predictions/chs?" + params.toString()),
        fetch("/api/predictions/chs-tides?" + params.toString()),
      ]);

      const noaaStations =
        (await noaaResponse.json()) as StationWithPrediction[];
      const chsStations =
        (await chsResponse.json()) as StationWithPrediction[];
      const chsTideStations =
        (await tideResponse.json()) as TideStationWithPrediction[];

      const allCurrentStations = [...noaaStations, ...chsStations];
      setStations(allCurrentStations);
      setTideStations(chsTideStations);

      if (allCurrentStations.length > 0) {
        setDates(
          allCurrentStations[0].predictions.map(({ Time }) => new Date(Time))
        );
      }
    };
    fetchStationData();
  }, []);

  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <Map>
        {/* TODO: could memoize this or the stations themselves */}
        {stations.map((s) => (
          <StationMarker key={s.id} {...s} index={sliderValue} />
        ))}
        {tideStations.map((s) => (
          <TideMarker key={s.id} {...s} index={sliderValue} />
        ))}
      </Map>
      <Title />
      <Legend />
      <Controls
        dates={dates}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
      />
    </div>
  );
}

export default App;
