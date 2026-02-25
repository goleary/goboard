import type { Metadata } from "next";
import SeattleTransitClient from "./SeattleTransitClient";

export const metadata: Metadata = {
  title: "Seattle Transit - Columbia City Light Rail",
  description:
    "Real-time Link Light Rail arrivals at Columbia City station, northbound and southbound.",
};

export default function SeattleTransitPage() {
  return <SeattleTransitClient />;
}
