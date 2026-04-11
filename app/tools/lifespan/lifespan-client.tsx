"use client";

import { useState, useMemo } from "react";

// SSA 2022 Period Life Table — male expected remaining years by age (0–119)
// Source: https://www.ssa.gov/oact/STATS/table4c6.html
const MALE_REMAINING = [
  74.74, 74.2, 73.23, 72.25, 71.27, 70.29, 69.3, 68.31, 67.32, 66.32, 65.33,
  64.34, 63.35, 62.36, 61.37, 60.39, 59.42, 58.46, 57.5, 56.56, 55.63, 54.7,
  53.78, 52.86, 51.94, 51.03, 50.12, 49.21, 48.31, 47.41, 46.51, 45.62,
  44.73, 43.84, 42.96, 42.08, 41.19, 40.31, 39.43, 38.55, 37.67, 36.8, 35.93,
  35.05, 34.19, 33.32, 32.46, 31.6, 30.75, 29.9, 29.05, 28.22, 27.39, 26.56,
  25.75, 24.94, 24.15, 23.37, 22.59, 21.83, 21.08, 20.34, 19.61, 18.89,
  18.18, 17.48, 16.79, 16.11, 15.43, 14.76, 14.09, 13.44, 12.8, 12.16, 11.53,
  10.92, 10.32, 9.74, 9.18, 8.64, 8.11, 7.6, 7.11, 6.64, 6.18, 5.75, 5.34,
  4.94, 4.58, 4.23, 3.91, 3.6, 3.32, 3.06, 2.83, 2.63, 2.44, 2.28, 2.13, 2.0,
  1.88, 1.76, 1.66, 1.56, 1.47, 1.39, 1.31, 1.23, 1.15, 1.08, 1.01, 0.94,
  0.87, 0.81, 0.75, 0.7, 0.64, 0.59, 0.54, 0.5,
];

const FEMALE_REMAINING = [
  80.28, 79.72, 78.75, 77.76, 76.78, 75.79, 74.8, 73.8, 72.81, 71.82, 70.82,
  69.83, 68.83, 67.84, 66.85, 65.86, 64.87, 63.89, 62.91, 61.94, 60.97,
  60.01, 59.05, 58.09, 57.13, 56.17, 55.22, 54.26, 53.31, 52.35, 51.4, 50.45,
  49.5, 48.55, 47.61, 46.66, 45.72, 44.78, 43.84, 42.9, 41.96, 41.03, 40.1,
  39.17, 38.25, 37.33, 36.41, 35.5, 34.59, 33.69, 32.79, 31.9, 31.01, 30.13,
  29.26, 28.39, 27.53, 26.68, 25.83, 24.99, 24.16, 23.34, 22.53, 21.72,
  20.93, 20.14, 19.37, 18.6, 17.85, 17.1, 16.37, 15.64, 14.93, 14.23, 13.54,
  12.86, 12.2, 11.55, 10.92, 10.31, 9.72, 9.14, 8.59, 8.05, 7.54, 7.05, 6.58,
  6.14, 5.72, 5.33, 4.96, 4.62, 4.3, 4.01, 3.73, 3.49, 3.26, 3.05, 2.86,
  2.69, 2.53, 2.38, 2.24, 2.11, 1.99, 1.87, 1.76, 1.66, 1.56, 1.47, 1.38,
  1.29, 1.21, 1.13, 1.06, 0.99, 0.92, 0.86, 0.8, 0.74,
];

type Sex = "male" | "female";

function getExpectedLifespan(
  birthdate: Date,
  now: Date,
  sex: Sex
): number {
  const ageMs = now.getTime() - birthdate.getTime();
  const age = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));
  const table = sex === "male" ? MALE_REMAINING : FEMALE_REMAINING;
  const clampedAge = Math.min(Math.max(age, 0), table.length - 1);
  return age + table[clampedAge];
}

function weeksLived(birthdate: Date, now: Date): number {
  const ms = now.getTime() - birthdate.getTime();
  return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}

export default function LifespanClient() {
  const [birthdateStr, setBirthdateStr] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [submitted, setSubmitted] = useState(false);

  const now = useMemo(() => new Date(), []);

  const birthdate = useMemo(() => {
    if (!birthdateStr) return null;
    const [y, m, d] = birthdateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [birthdateStr]);

  const data = useMemo(() => {
    if (!birthdate || !submitted) return null;
    const lived = weeksLived(birthdate, now);
    const lifespan = getExpectedLifespan(birthdate, now, sex);
    const total = Math.round(lifespan * 52);
    const remaining = total - lived;
    const ageMs = now.getTime() - birthdate.getTime();
    const age = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));
    return { lived, total, remaining, lifespan, age };
  }, [birthdate, now, sex, submitted]);

  return (
    <div className="min-h-screen bg-[#f8f5ee] text-[#3d3731]">
      <div className="max-w-lg mx-auto px-5 py-12">
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl text-[#5a5347] text-center mb-2">
          Your Life in Weeks
        </h1>
        <p className="text-center text-sm text-[#8a8479] mb-10 font-[family-name:var(--font-newsreader)]">
          Each square is one week. Based on SSA actuarial life tables.
        </p>

        {!data ? (
          <div className="space-y-6 max-w-xs mx-auto">
            <div>
              <label
                htmlFor="birthdate"
                className="block text-sm text-[#8a8479] mb-1"
              >
                Date of birth
              </label>
              <input
                id="birthdate"
                type="date"
                value={birthdateStr}
                onChange={(e) => setBirthdateStr(e.target.value)}
                className="w-full border border-[#d5d0c8] rounded-md px-3 py-2 bg-white text-[#3d3731] focus:outline-none focus:ring-1 focus:ring-[#c4bdb2]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#8a8479] mb-1">
                Sex (for life table)
              </label>
              <div className="flex gap-4">
                {(["male", "female"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSex(s)}
                    className={`px-4 py-1.5 rounded-md text-sm border transition-colors ${
                      sex === s
                        ? "bg-[#5a5347] text-[#f8f5ee] border-[#5a5347]"
                        : "border-[#d5d0c8] text-[#8a8479] hover:border-[#b0a99e]"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => birthdateStr && setSubmitted(true)}
              disabled={!birthdateStr}
              className="w-full py-2 rounded-md text-sm font-medium transition-colors bg-[#5a5347] text-[#f8f5ee] hover:bg-[#4a4439] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Show my weeks
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-baseline mb-4">
              <p className="text-xs text-[#8a8479]">
                Age {data.age} &middot; Expected lifespan{" "}
                {Math.round(data.lifespan)} years
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#8a8479] underline hover:text-[#5a5347]"
              >
                Change
              </button>
            </div>

            {/* Weeks grid */}
            <div
              className="mx-auto"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(52, 1fr)",
                gap: "1.5px",
                maxWidth: "320px",
              }}
            >
              {Array.from({ length: data.total }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-[1px] ${
                    i < data.lived
                      ? i === data.lived - 1
                        ? "bg-[#6b5c4c]"
                        : "bg-[#c4bdb2]"
                      : "bg-[#ece8e0]"
                  }`}
                />
              ))}
            </div>

            <p className="text-center text-xs text-[#8a8479] mt-3 leading-relaxed">
              {data.lived.toLocaleString()} weeks lived &middot;{" "}
              {data.remaining.toLocaleString()} remaining &middot; This is week{" "}
              {(data.lived + 1).toLocaleString()}
            </p>

            <p className="text-center text-xs text-[#b0a99e] mt-6 font-[family-name:var(--font-newsreader)] italic">
              &ldquo;The proper function of man is to live, not to exist.&rdquo;
              &mdash; Jack London
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
