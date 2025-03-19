"use client";
import React, { useEffect, useState } from "react";

import dateFormat from "dateformat";

import { StationWithPrediction } from "./types";
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
function App() {
  const [stations, setStations] = useState<StationWithPrediction[]>([]);

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
      const response = await fetch("/api/predictions?" + params.toString(), {});
      const stationsResult = (await response.json()) as StationWithPrediction[];
      setStations(stationsResult);

      setDates(stationsResult[0].predictions.map(({ Time }) => new Date(Time)));
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
