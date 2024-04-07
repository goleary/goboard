import { celsiusToFahrenheit } from "@/lib/utils";
import { LineChart } from "@tremor/react";
import Chart from "./chart";

type HistoricalRecord = {
  date: string;
  "Water Temperature": number;
};

async function getHistoricalData(
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
    "Water Temperature": celsiusToFahrenheit(Value),
  }));
}

type HistoryProps = {
  location: string;
};

const History: React.FC<HistoryProps> = async ({ location }) => {
  const historicalData = await getHistoricalData(location);
  return <Chart data={historicalData} />;
};

export default History;
