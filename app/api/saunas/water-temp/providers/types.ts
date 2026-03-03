export interface WaterTempResponse {
  /** Water temperature in Fahrenheit */
  waterTempF: number;
  /** When the temperature was measured (ISO 8601) */
  measuredAt: string;
  /** Human-readable source attribution */
  source: string;
  /** URL to the source for attribution/linking */
  sourceUrl: string;
}
