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
import { ForecastGrid, DaylightCard, type DayForecast, type PeriodRating, type HourlyWind } from "./forecast-grid";
import Navbar from "@/components/navbar";

type BuoyStats = {
  location: string;
  weatherDateTime: Date;
  airTempCelsius: number;
  windSpeedMps: number;
  windDirection: string;
  waterDateTime: Date | null;
  waterTempCelsius: number | null;
};

function extractLakeStats(dataString: string, lakeName: string): BuoyStats {
  // Dynamically include the lakeName in the regex pattern
  // Water temp and water datetime are optional (may be empty)
  const pattern = new RegExp(
    lakeName +
      `(?:\\|(?<weatherDateTime>[^|]+))(?:\\|\\s*(?<air>\\d+\\.\\d+))(?:\\|\\s*(?<windSpeed>\\d+\\.\\d+))(?:\\|(?<windDirection>[^|]+))(?:\\|\\s*(?<water>\\d+\\.\\d+)?)(?:\\|(?<waterDateTime>[^|]*))`,
    "i"
  );

  const match = dataString.match(pattern);

  if (match?.groups) {
    const weatherDateTime = new Date(match.groups.weatherDateTime);

    const air = parseFloat(match.groups.air);
    const wind = parseFloat(match.groups.windSpeed);
    const windDirection = match.groups.windDirection;
    const waterDateTimeStr = match.groups.waterDateTime?.trim();
    const waterDateTime = waterDateTimeStr ? new Date(waterDateTimeStr) : null;
    const waterStr = match.groups.water?.trim();
    const water = waterStr ? parseFloat(waterStr) : null;
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
    <main className="min-h-screen max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col items-center gap-4 mb-6">
        <Navbar />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 mb-6">
        Seattle Lake Stats
      </h1>

      <div className="space-y-6">
        <WeatherForecast />
        <div className="grid grid-cols-2 gap-6">
          <StatCard
            title="Lake Washington"
            stats={lakeStats.washington}
          ></StatCard>
          <StatCard
            title="Lake Sammamish"
            stats={lakeStats.sammamish}
          ></StatCard>
        </div>
      </div>
      <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
        <p>
          Data sourced from{" "}
          <a
            href="https://green2.kingcounty.gov/lake-buoy/default.aspx"
            className="text-blue-600 hover:text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            King County Lake Buoy data
          </a>
        </p>
        <p>
          Created by{" "}
          <a className="text-blue-600 hover:text-blue-500" href="/">
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
              {stats.waterTempCelsius !== null ? (
                <span
                  className={getWaterTempColor(stats.waterTempCelsius, "c")}
                >
                  {formatNumber(celsiusToFahrenheit(stats.waterTempCelsius), 1)}{" "}
                  °F
                </span>
              ) : (
                <span className="text-slate-400">N/A</span>
              )}
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
        <CardFooter className="p-0 -mx-6">
          <History location={stats.location} />
        </CardFooter>
      </CardHeader>
    </Card>
  );
};

const LAKE_WA_LAT = 47.6275;
const LAKE_WA_LON = -122.2417;

function ratePeriod(maxWindKph: number): "excellent" | "great" | "good" | "fair" | "poor" {
  const mph = Math.round(maxWindKph * 0.621371);
  if (mph >= 15) return "poor";
  if (mph >= 10) return "fair";
  if (mph >= 5) return "good";
  if (mph >= 3) return "great";
  return "excellent";
}

async function getForecast(): Promise<DayForecast[]> {
  // Let Open-Meteo determine "today" via timezone=America/Los_Angeles param
  // Just compute date range relative to UTC (off by a day at most, API handles it)
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const end = new Date(now);
  end.setDate(end.getDate() + 15); // request extra days to account for timezone offset
  const endDate = end.toISOString().split("T")[0];

  // Fetch daily + hourly in parallel — no-store to always get fresh data
  const [dailyRes, hourlyRes] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAKE_WA_LAT}&longitude=${LAKE_WA_LON}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_mean,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,cloud_cover_mean,sunrise,sunset,weather_code&start_date=${today}&end_date=${endDate}&temperature_unit=fahrenheit&timezone=America/Los_Angeles`, { cache: "no-store" }),
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAKE_WA_LAT}&longitude=${LAKE_WA_LON}&hourly=wind_speed_10m,wind_gusts_10m,precipitation_probability&start_date=${today}&end_date=${endDate}&timezone=America/Los_Angeles`, { cache: "no-store" }),
  ]);

  if (!dailyRes.ok) {
    console.error("Forecast API failed:", dailyRes.status, await dailyRes.text().catch(() => ""));
    return [];
  }
  const data = await dailyRes.json();
  const daily = data.daily;
  if (!daily?.time) return [];

  // Parse hourly data for period bucketing
  const hourly = hourlyRes.ok ? (await hourlyRes.json()).hourly : null;

  // Build maps of date -> period ratings and hourly wind
  const periodMap = new Map<string, PeriodRating[]>();
  const hourlyWindMap = new Map<string, HourlyWind[]>();
  if (hourly?.time) {
    // Group hourly data by date
    const byDate = new Map<string, { hour: number; windKph: number; gustKph: number; precipProb: number }[]>();
    for (let i = 0; i < hourly.time.length; i++) {
      const dateStr = (hourly.time[i] as string).slice(0, 10);
      const hour = parseInt((hourly.time[i] as string).slice(11, 13));
      if (!byDate.has(dateStr)) byDate.set(dateStr, []);
      byDate.get(dateStr)!.push({
        hour,
        windKph: hourly.wind_speed_10m[i] ?? 0,
        gustKph: hourly.wind_gusts_10m?.[i] ?? 0,
        precipProb: hourly.precipitation_probability[i] ?? 0,
      });
    }

    for (const [dateStr, hours] of byDate) {
      // Get sunrise hour for this date (default 6am)
      const dayIdx = daily.time.indexOf(dateStr);
      const sunriseStr = dayIdx >= 0 ? daily.sunrise?.[dayIdx] ?? "" : "";
      const dawnHour = sunriseStr ? parseInt(sunriseStr.slice(11, 13)) : 6;

      const buckets = [
        { label: `Dawn–11am`, startHour: dawnHour, endHour: 11 },
        { label: `11am–3pm`, startHour: 11, endHour: 15 },
        { label: `3pm–Dusk`, startHour: 15, endHour: 21 },
      ];

      const periods: PeriodRating[] = buckets.map((b) => {
        const bucketHours = hours.filter((h) => h.hour >= b.startHour && h.hour < b.endHour);
        const maxWind = bucketHours.length > 0 ? Math.max(...bucketHours.map((h) => h.windKph)) : 0;
        const maxPrecip = bucketHours.length > 0 ? Math.max(...bucketHours.map((h) => h.precipProb)) : 0;
        return {
          label: b.label,
          level: ratePeriod(maxWind),
          maxSustainedMph: Math.round(maxWind * 0.621371),
          precipProbability: maxPrecip,
        };
      });

      periodMap.set(dateStr, periods);

      hourlyWindMap.set(dateStr, hours.map((h) => {
        const wind = Math.round(h.windKph * 0.621371);
        const gust = Math.round(h.gustKph * 0.621371);
        return {
          hour: h.hour,
          windMph: wind,
          gustMph: Math.max(gust, wind),
        };
      }));
    }
  }

  return daily.time.map((date: string, i: number) => ({
    date,
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    precipProbability: daily.precipitation_probability_max?.[i] ?? 0,
    precipSum: daily.precipitation_sum[i],
    windSpeedMean: daily.wind_speed_10m_mean?.[i] ?? 0,
    windSpeedMax: daily.wind_speed_10m_max[i],
    windGustsMax: daily.wind_gusts_10m_max?.[i] ?? 0,
    windDirection: daily.wind_direction_10m_dominant?.[i] ?? 0,
    cloudCover: daily.cloud_cover_mean?.[i] ?? 0,
    sunrise: daily.sunrise?.[i]?.slice(11) ?? "",
    sunset: daily.sunset?.[i]?.slice(11) ?? "",
    weatherCode: daily.weather_code[i],
    periods: periodMap.get(date),
    hourlyWind: hourlyWindMap.get(date),
  }));
}

async function WeatherForecast() {
  const days = await getForecast();
  if (days.length === 0) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <ForecastGrid days={days} />
      </CardContent>
    </Card>
  );
}

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
