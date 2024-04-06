import {
  Card,
  CardContent,
  CardDescription,
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
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
const db = new PrismaClient();

// TODO: add this
// function getHistoricalData() {
//   const response = fetch(
//     "https://green2.kingcounty.gov/lake-buoy/HistoricalTemperature.aspx/GetData",
//     {
//       headers: {
//         accept: "application/json, text/javascript, */*; q=0.01",
//         "accept-language": "en-US,en;q=0.9",
//         "cache-control": "no-cache",
//         "content-type": "application/json; charset=UTF-8",
//         pragma: "no-cache",
//         "sec-ch-ua":
//           '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": '"macOS"',
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "same-origin",
//         "x-requested-with": "XMLHttpRequest",
//         cookie:
//           "_ga=GA1.1.1900066909.1710301966; nmstat=2aa22028-2bbd-739b-8418-6439f63739ec; ASP.NET_SessionId=di0ptwhx4lseeyvcsoe2phkp; WCMS_ASP.NET_SessionId=rfif4ccrkknz4dyjj0rxs4o5; _ga_87SLBPDRY7=GS1.1.1711831754.1.1.1711831969.0.0.0; TS0126a747=017eac84075cb9c8310cb6260ce7d060ab18c6809b5e44b989f73cbf19770d37e565dd58db1be0473b3d5f6902761f63308208c2dc5fd4c0f7d17c0295e9828e8b0788f3e083bc67f86de74980c54246f9f4e78105; TS01d0cb72=017eac84072b5623a4087555f10f81cb83dc7de13232f34ea80c3aec426b8046cf9b7289ba9b97f7dbfaf19c42cd2413686efc4fede3bd401bb4f11c35e1b8757b2373d329306e6d234542de60f24e1d050688626748e72173311313faf0938f8da1a60481c3dcac4cee5a91da140e7fa3fd84ed75; _ga_W2BH6TXD2Z=GS1.1.1711835467.3.1.1711835517.0.0.0",
//         Referer:
//           "https://green2.kingcounty.gov/lake-buoy/HistoricalTemperature.aspx",
//         "Referrer-Policy": "strict-origin-when-cross-origin",
//       },
//       body: "{ buoy: 'washington'}",
//       method: "POST",
//     }
//   );
// }

type BuoyStats = {
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
      weatherDateTime,
      airTempCelsius: air,
      windSpeedMps: wind,
      windDirection,
      waterDateTime,
      waterTempCelsius: water,
    };
  } else {
    throw new Error("Failed to extract data");
  }
}

const recordStats = async (stats: BuoyStats, lakeName: string) => {
  try {
    await db.weatherRecord.create({
      data: {
        location: lakeName,
        airTempFarenheit: stats.airTempCelsius,
        windSpeedMph: stats.windSpeedMps,
        windDirection: stats.windDirection,
        dateTime: stats.weatherDateTime,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      // This is a duplicate error, so we can ignore it
    } else {
      throw e;
    }
  }
  try {
    await db.waterRecord.create({
      data: {
        location: lakeName,
        waterTempFarenheit: stats.waterTempCelsius,
        dateTime: stats.waterDateTime,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      // This is a duplicate error, so we can ignore it
    } else {
      throw e;
    }
  }
};

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
  await recordStats(washingtonStats, "washington");
  await recordStats(sammamishStats, "sammamish");

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
        <CardContent className={"text-4x flex justify-start gap-4 pt-4"}>
          <div className="flex gap-2 items-center">
            <WavesIcon className="inline-block w-8 h-8 " />{" "}
            <span className={getWaterTempColor(stats.waterTempCelsius, "c")}>
              {formatNumber(celsiusToFahrenheit(stats.waterTempCelsius), 1)} °F
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
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default LakeTemp;

// TODO: would be better to use d3 for this
const getWaterTempColor = (temperature: number, unit: "f" | "c" = "f") => {
  const temperatureFarenheit =
    unit === "f" ? temperature : celsiusToFahrenheit(temperature);
  if (temperatureFarenheit < 45) {
    return "text-blue-500";
  }
  if (temperatureFarenheit <= 50) {
    return "text-sky-500";
  }
  if (temperatureFarenheit <= 55) {
    return "text-cyan-500";
  }
  if (temperatureFarenheit <= 60) {
    return "text-teal-500";
  }
  if (temperatureFarenheit <= 65) {
    return "text-emerald-500";
  }
  if (temperatureFarenheit <= 70) {
    return "text-green-500";
  }
  if (temperatureFarenheit <= 75) {
    return "text-yellow-500";
  }
  if (temperatureFarenheit <= 80) {
    return "text-amber-500";
  }
  if (temperatureFarenheit <= 85) {
    return "text-orange-500";
  }
  if (temperatureFarenheit <= 90) {
    return "text-red-500";
  }
  return "text-slate-800";
};

const getAirTempColor = (temperature: number, unit: "f" | "c" = "f") => {
  const temperatureFarenheit =
    unit === "f" ? temperature : celsiusToFahrenheit(temperature);
  if (temperatureFarenheit < 20) {
    return "text-blue-500";
  }
  if (temperatureFarenheit <= 32) {
    return "text-sky-500";
  }
  if (temperatureFarenheit <= 40) {
    return "text-cyan-500";
  }
  if (temperatureFarenheit <= 50) {
    return "text-teal-500";
  }
  if (temperatureFarenheit <= 60) {
    return "text-emerald-500";
  }
  if (temperatureFarenheit <= 70) {
    return "text-green-500";
  }
  if (temperatureFarenheit <= 80) {
    return "text-yellow-500";
  }
  if (temperatureFarenheit <= 90) {
    return "text-amber-500";
  }
  if (temperatureFarenheit <= 95) {
    return "text-orange-500";
  }
  if (temperatureFarenheit <= 100) {
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
