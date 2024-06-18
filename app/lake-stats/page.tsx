import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

import {
  celsiusToFahrenheit,
  formatNumber,
  metersPerSecondToMph,
} from "@/lib/utils";
import { ThermometerIcon, WavesIcon, WindIcon } from "lucide-react";
import History from "@/components/history";

type BuoyStats = {
  location: string;
  weatherDateTime: Date;
  airTempCelsius: number;
  windSpeedMps: number;
  windDirection: string;
  waterDateTime: Date;
  waterTempCelsius: number;
};

function extractLakeStats(dataString: string, lakeName: string): BuoyStats {
  // Dynamically include the lakeName in the regex pattern
  const pattern = new RegExp(
    lakeName +
      `(?:\\|(?<weatherDateTime>[^\|]+))(?:\\|\\s+(?<air>\\d+\\.\\d+))(?:\\|\\s+(?<windSpeed>\\d+\\.\\d+))(?:\\|(?<windDirection>[^\|]+))(?:\\|\\s+(?<water>\\d+\\.\\d+))(?:\\|(?<waterDateTime>[^\|]+))`,
    "i"
  );

  const match = dataString.match(pattern);

  if (match && match.groups) {
    const weatherDateTime = new Date(match.groups.weatherDateTime);

    const air = parseFloat(match.groups.air);
    const wind = parseFloat(match.groups.windSpeed);
    const windDirection = match.groups.windDirection;
    const waterDateTime = new Date(match.groups.waterDateTime);
    const water = parseFloat(match.groups.water);
    return {
      location: lakeName,
      weatherDateTime,
      airTempCelsius: air,
      windSpeedMps: wind,
      windDirection,
      waterDateTime,
      waterTempCelsius: water,
    };
  } else {
    console.log("Failed to extract data");
    console.log("dataString", dataString);
    console.log("lakeName", lakeName);
    console.log("match", match);
    throw new Error("Failed to extract data");
  }
}

async function getData() {
  const res = await fetch(
    "https://green2.kingcounty.gov/lake-buoy/GenerateMapData.aspx",
    { cache: "no-store" }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  const data = await res.text();
  const washingtonStats = extractLakeStats(data, "washington");
  const sammamishStats = extractLakeStats(data, "sammamish");

  return {
    washington: washingtonStats,
    sammamish: sammamishStats,
  };
}

const LakeTemp: React.FC = async () => {
  const lakeStats = await getData();
  if (!lakeStats) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-[400px]">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">
          Seattle Lake Stats
        </h1>
        <p className="text-md text-slate-700 mb-6">
          Data sourced from{" "}
          <a
            href="https://green2.kingcounty.gov/lake-buoy/default.aspx"
            className="text-blue-600 hover:text-blue-500"
            target="_blank"
          >
            King County Lake Buoy data
          </a>
        </p>

        <div className="flex flex-col justify-start gap-4 my-6">
          <StatCard
            title="Lake Washington"
            stats={lakeStats.washington}
          ></StatCard>
          <StatCard
            title="Lake Sammamish"
            stats={lakeStats.sammamish}
          ></StatCard>
        </div>
        <p className="">
          Created by{" "}
          <a
            className="text-blue-600 hover:text-blue-500"
            href="https://goleary.com"
            target="_blank"
          >
            {"Gabe O'Leary"}
          </a>
        </p>
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Seattle Lake Stats",
  description:
    "View the latest temperature and wind speed data for Lake Washington and Lake Sammamish",
};

type StatCardProps = {
  title: string;
  stats: BuoyStats;
};

const StatCard = ({ title, stats }: StatCardProps): React.ReactElement => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription></CardDescription>
        <CardTitle className="text-slate-800">{title}</CardTitle>
        <CardContent>
          <div className={"text-4x flex justify-start gap-4 pt-4"}>
            <div className="flex gap-2 items-center">
              <WavesIcon className="inline-block w-8 h-8 " />{" "}
              <span className={getWaterTempColor(stats.waterTempCelsius, "c")}>
                {formatNumber(celsiusToFahrenheit(stats.waterTempCelsius), 1)}{" "}
                °F
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <ThermometerIcon className="inline-block w-8 h-8 mr-2" />{" "}
              <span className={getAirTempColor(stats.airTempCelsius, "c")}>
                {formatNumber(celsiusToFahrenheit(stats.airTempCelsius), 1)} °F
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <WindIcon className="inline-block w-8 h-8 mr-2" />{" "}
              <span className={getWindSpeedColor(stats.windSpeedMps, "mps")}>
                {formatNumber(metersPerSecondToMph(stats.windSpeedMps), 1)} mph
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4">
          <History location={stats.location} />
        </CardFooter>
      </CardHeader>
    </Card>
  );
};

export default LakeTemp;

// TODO: would be better to use d3 for this
const getWaterTempColor = (temperature: number, unit: "f" | "c" = "f") => {
  const temperatureFahrenheit =
    unit === "f" ? temperature : celsiusToFahrenheit(temperature);
  if (temperatureFahrenheit < 45) {
    return "text-blue-500";
  }
  if (temperatureFahrenheit <= 50) {
    return "text-sky-500";
  }
  if (temperatureFahrenheit <= 55) {
    return "text-cyan-500";
  }
  if (temperatureFahrenheit <= 60) {
    return "text-teal-500";
  }
  if (temperatureFahrenheit <= 65) {
    return "text-emerald-500";
  }
  if (temperatureFahrenheit <= 70) {
    return "text-green-500";
  }
  if (temperatureFahrenheit <= 75) {
    return "text-yellow-500";
  }
  if (temperatureFahrenheit <= 80) {
    return "text-amber-500";
  }
  if (temperatureFahrenheit <= 85) {
    return "text-orange-500";
  }
  if (temperatureFahrenheit <= 90) {
    return "text-red-500";
  }
  return "text-slate-800";
};

const getAirTempColor = (temperature: number, unit: "f" | "c" = "f") => {
  const temperatureFahrenheit =
    unit === "f" ? temperature : celsiusToFahrenheit(temperature);
  if (temperatureFahrenheit < 20) {
    return "text-blue-500";
  }
  if (temperatureFahrenheit <= 32) {
    return "text-sky-500";
  }
  if (temperatureFahrenheit <= 40) {
    return "text-cyan-500";
  }
  if (temperatureFahrenheit <= 50) {
    return "text-teal-500";
  }
  if (temperatureFahrenheit <= 60) {
    return "text-emerald-500";
  }
  if (temperatureFahrenheit <= 70) {
    return "text-green-500";
  }
  if (temperatureFahrenheit <= 80) {
    return "text-yellow-500";
  }
  if (temperatureFahrenheit <= 90) {
    return "text-amber-500";
  }
  if (temperatureFahrenheit <= 95) {
    return "text-orange-500";
  }
  if (temperatureFahrenheit <= 100) {
    return "text-red-500";
  }
  return "text-slate-800";
};

const getWindSpeedColor = (speed: number, unit: "mph" | "mps" = "mph") => {
  const speedMph = unit === "mph" ? speed : metersPerSecondToMph(speed);
  if (speedMph < 1) {
    return "text-blue-400";
  }
  if (speedMph < 3) {
    return "text-blue-500";
  }
  if (speedMph <= 5) {
    return "text-sky-500";
  }
  if (speedMph <= 7.5) {
    return "text-cyan-500";
  }
  if (speedMph <= 10) {
    return "text-teal-500";
  }
  if (speedMph <= 12.5) {
    return "text-yellow-500";
  }
  if (speedMph <= 15) {
    return "text-amber-500";
  }
  if (speedMph <= 20) {
    return "text-orange-500";
  }
  if (speedMph <= 25) {
    return "text-red-500";
  }
  if (speedMph <= 30) {
    return "text-red-600";
  }
  if (speedMph <= 35) {
    return "text-red-700";
  }
  return "text-red-800";
};
