import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function celsiusToFahrenheit(celsius: number) {
  return celsius * 1.8 + 32;
}

export function metersPerSecondToMph(mps: number) {
  return mps * 2.237;
}

export const formatNumber = (num: number, maximumFractionDigits = 0) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits,
  });
  return formatter.format(num);
};
