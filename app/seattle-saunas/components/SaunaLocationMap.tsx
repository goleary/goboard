"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { type Sauna } from "@/data/saunas/seattle-saunas";

// Dynamic import for map (client-only)
const SaunaMap = dynamic(() => import("./SaunaMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-[200px] w-full rounded-lg" />,
});

interface SaunaLocationMapProps {
  sauna: Sauna;
}

export function SaunaLocationMap({ sauna }: SaunaLocationMapProps) {
  return (
    <div className="h-[200px] rounded-lg overflow-hidden">
      <SaunaMap saunas={[sauna]} center={[sauna.lat, sauna.lng]} zoom={14} />
    </div>
  );
}


