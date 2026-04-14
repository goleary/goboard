import type { Metadata } from "next";
import { Fraunces, Newsreader } from "next/font/google";
import FiniteApp from "./finite-app";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finite",
  description: "You have roughly 4,000 weeks.",
};

export default function FinitePage() {
  return (
    <div className={`${fraunces.variable} ${newsreader.variable}`}>
      <FiniteApp />
    </div>
  );
}
