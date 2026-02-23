import type { TideDataPoint } from "@/app/api/saunas/tides/route";

export type TideLevel = "great" | "ok" | "low";

/**
 * Linearly interpolate the tide height at a given time from hourly data points.
 * Returns null if the hourly array is empty.
 * Clamps to nearest endpoint if time is outside the data range.
 */
export function interpolateTideHeight(
  hourly: TideDataPoint[],
  timeMs: number
): number | null {
  if (hourly.length === 0) return null;

  const points = hourly.map((p) => ({
    t: new Date(p.time.replace(" ", "T")).getTime(),
    h: p.height,
  }));

  if (timeMs <= points[0].t) return points[0].h;
  if (timeMs >= points[points.length - 1].t)
    return points[points.length - 1].h;

  for (let i = 0; i < points.length - 1; i++) {
    if (timeMs >= points[i].t && timeMs <= points[i + 1].t) {
      const fraction =
        (timeMs - points[i].t) / (points[i + 1].t - points[i].t);
      return points[i].h + fraction * (points[i + 1].h - points[i].h);
    }
  }
  return null;
}

/**
 * Classify a tide height into great/ok/low based on the day's range.
 *   >= 0.65 of range → great
 *   0.35 – 0.65      → ok
 *   < 0.35           → low
 */
export function classifyTideLevel(
  height: number,
  hourly: TideDataPoint[]
): TideLevel {
  const heights = hourly.map((p) => p.height);
  const min = Math.min(...heights);
  const max = Math.max(...heights);
  const range = max - min;

  if (range === 0) return "ok";

  const fraction = (height - min) / range;
  if (fraction >= 0.65) return "great";
  if (fraction >= 0.35) return "ok";
  return "low";
}

/**
 * For a given slot time and day's hourly data, return the tide level.
 */
export function getTideLevelForSlot(
  slotTimeStr: string,
  hourly: TideDataPoint[]
): TideLevel | null {
  const normalized = slotTimeStr.replace(" ", "T");
  const timeMs = new Date(normalized).getTime();
  if (isNaN(timeMs)) return null;

  const height = interpolateTideHeight(hourly, timeMs);
  if (height === null) return null;

  return classifyTideLevel(height, hourly);
}
