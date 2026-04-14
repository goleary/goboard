import type { Metadata } from "next";
import { Fraunces, Newsreader } from "next/font/google";
import LifespanClient from "./lifespan-client";

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
  title: "Lifespan in Weeks",
  description:
    "See your life as a grid of weeks. Based on SSA actuarial life tables.",
};

export default function LifespanPage() {
  return (
    <div className={`${fraunces.variable} ${newsreader.variable}`}>
      <LifespanClient />
    </div>
  );
}
