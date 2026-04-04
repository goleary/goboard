import { NextResponse } from "next/server";

// Lund, BC — near Desolation Sound
const LAT = 49.98;
const LON = -124.77;

export interface DailyWeather {
  date: string;
  tempMax: number; // °F
  tempMin: number; // °F
  precipProbability: number; // 0-100
  precipSum: number; // mm
  windSpeedMax: number; // km/h
  weatherCode: number;
  source: "forecast" | "historical";
}

function weatherCodeLabel(code: number): string {
  // WMO weather interpretation codes
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Fog";
  if (code <= 55) return "Drizzle";
  if (code <= 57) return "Freezing drizzle";
  if (code <= 65) return "Rain";
  if (code <= 67) return "Freezing rain";
  if (code <= 75) return "Snow";
  if (code <= 77) return "Snow grains";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

export { weatherCodeLabel };

async function fetchForecast(
  startDate: string,
  endDate: string,
  lat: number,
  lon: number
): Promise<DailyWeather[]> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,weather_code&start_date=${startDate}&end_date=${endDate}&temperature_unit=fahrenheit&timezone=auto`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const data = await res.json();
  const daily = data.daily;
  if (!daily?.time) return [];

  return daily.time.map((date: string, i: number) => ({
    date,
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    precipProbability: daily.precipitation_probability_max?.[i] ?? 0,
    precipSum: daily.precipitation_sum[i],
    windSpeedMax: daily.wind_speed_10m_max[i],
    weatherCode: daily.weather_code[i],
    source: "forecast" as const,
  }));
}

async function fetchHistoricalAverages(
  startDate: string,
  endDate: string,
  lat: number,
  lon: number
): Promise<DailyWeather[]> {
  // Use last 5 years of historical data to compute averages
  const startYear = 2020;
  const endYear = 2025;
  const startMd = startDate.slice(5); // MM-DD
  const endMd = endDate.slice(5);

  const yearResults = await Promise.all(
    Array.from({ length: endYear - startYear + 1 }, (_, i) => {
      const year = startYear + i;
      const s = `${year}-${startMd}`;
      const e = `${year}-${endMd}`;
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code&start_date=${s}&end_date=${e}&temperature_unit=fahrenheit&timezone=auto`;
      return fetch(url, { next: { revalidate: 86400 } })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
    })
  );

  // Group by day-of-year and average
  const dayMap = new Map<
    string,
    { temps: number[]; mins: number[]; precip: number[]; wind: number[]; codes: number[] }
  >();

  for (const result of yearResults) {
    if (!result?.daily?.time) continue;
    const d = result.daily;
    for (let i = 0; i < d.time.length; i++) {
      const md = (d.time[i] as string).slice(5); // MM-DD
      if (!dayMap.has(md)) {
        dayMap.set(md, { temps: [], mins: [], precip: [], wind: [], codes: [] });
      }
      const entry = dayMap.get(md)!;
      if (d.temperature_2m_max[i] != null) entry.temps.push(d.temperature_2m_max[i]);
      if (d.temperature_2m_min[i] != null) entry.mins.push(d.temperature_2m_min[i]);
      if (d.precipitation_sum[i] != null) entry.precip.push(d.precipitation_sum[i]);
      if (d.wind_speed_10m_max[i] != null) entry.wind.push(d.wind_speed_10m_max[i]);
      if (d.weather_code[i] != null) entry.codes.push(d.weather_code[i]);
    }
  }

  const targetYear = parseInt(startDate.slice(0, 4));
  const results: DailyWeather[] = [];

  // Walk through each date in the range
  const current = new Date(startDate + "T12:00:00");
  const end = new Date(endDate + "T12:00:00");
  while (current <= end) {
    const md = current.toISOString().slice(5, 10);
    const dateStr = `${targetYear}-${md}`;
    const entry = dayMap.get(md);

    if (entry && entry.temps.length > 0) {
      const avg = (arr: number[]) =>
        Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;
      // Most common weather code
      const modeCode = entry.codes
        .sort(
          (a, b) =>
            entry.codes.filter((c) => c === b).length -
            entry.codes.filter((c) => c === a).length
        )[0] ?? 0;
      // Precip probability = % of years that had >0.5mm
      const precipProb = Math.round(
        (entry.precip.filter((p) => p > 0.5).length / entry.precip.length) * 100
      );

      results.push({
        date: dateStr,
        tempMax: avg(entry.temps),
        tempMin: avg(entry.mins),
        precipProbability: precipProb,
        precipSum: avg(entry.precip),
        windSpeedMax: avg(entry.wind),
        weatherCode: modeCode,
        source: "historical",
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return results;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("start_date") ?? "2026-05-17";
  const endDate = searchParams.get("end_date") ?? "2026-06-06";
  const lat = parseFloat(searchParams.get("lat") ?? String(LAT));
  const lon = parseFloat(searchParams.get("lon") ?? String(LON));

  // Check if dates are within forecast range (16 days from now)
  const now = new Date();
  const forecastLimit = new Date(now);
  forecastLimit.setDate(forecastLimit.getDate() + 16);
  const forecastLimitStr = forecastLimit.toISOString().split("T")[0];

  let days: DailyWeather[] = [];

  if (startDate <= forecastLimitStr) {
    const forecastEnd =
      endDate <= forecastLimitStr ? endDate : forecastLimitStr;
    const forecastDays = await fetchForecast(startDate, forecastEnd, lat, lon);
    days = [...forecastDays];

    if (endDate > forecastLimitStr) {
      const nextDay = new Date(forecastLimitStr + "T12:00:00");
      nextDay.setDate(nextDay.getDate() + 1);
      const histStart = nextDay.toISOString().split("T")[0];
      const histDays = await fetchHistoricalAverages(histStart, endDate, lat, lon);
      days = [...days, ...histDays];
    }
  } else {
    days = await fetchHistoricalAverages(startDate, endDate, lat, lon);
  }

  return NextResponse.json({
    days,
    checkedAt: new Date().toISOString(),
    location: { name: "Lund, BC", lat: LAT, lon: LON },
  });
}
