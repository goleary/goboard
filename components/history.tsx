import React from "react";
import { unstable_cache } from "next/cache";
import { celsiusToFahrenheit } from "@/lib/utils";

import HistoryChart from "./chart";

type HistoricalRecord = {
  date: string;
  waterTemperature: number;
};

async function fetchHistoricalData(
  buoy: string,
  year: number = new Date().getFullYear()
): Promise<HistoricalRecord[]> {

  const res = await fetch(
    "https://green2.kingcounty.gov/lake-buoy/HistoricalTemperature.aspx/GetData",
    {
      headers: {
        "content-type": "application/json",
        // Must disable compression (deflate)
        "Accept-Encoding": "identity",
      },
      body: `{ buoy: '${buoy}' }`,
      method: "POST",
      cache: "no-store",
    }
  );

  const { d } = await res.json();
  const data = JSON.parse(d) as Record<
    string,
    { date: string; Value: number }[]
  >;
  return data[year.toString()].map(({ date, Value }) => ({
    date: new Date(date.replace(/(AM|PM)$/i, " $1")).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    ),
    waterTemperature: celsiusToFahrenheit(Value),
  }));
}

const getHistoricalData = unstable_cache(
  fetchHistoricalData,
  ["lake-historical-data"],
  { revalidate: 3600 }
);

type HistoryProps = {
  location: string;
};

const History: React.FC<HistoryProps> = async ({ location }) => {
  const historicalData = await getHistoricalData(location);
  // gets rid of some erratic data.
  const filteredData = historicalData.filter((d) => d.waterTemperature > 32);
  return <HistoryChart historicalData={filteredData} />;
};

export default History;
