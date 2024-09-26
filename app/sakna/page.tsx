"use client";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Place } from "./api/types";

const Map = dynamic(() => import("./components/map"), {
  ssr: false,
});

export default function SaknaPage() {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const fetchPlaces = useCallback(async () => {
    if (!query) {
      return;
    }
    const params = new URLSearchParams({
      query: query,
    });
    const response = await fetch("/sakna/api?" + params.toString(), {});
    const placesResult = (await response.json()).places as Place[];
    setPlaces(placesResult);
    console.log(placesResult);
  }, [query]);

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <input
        className="m-4"
        type="text"
        placeholder="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={fetchPlaces}> search</button>
      <Map places={places} />
    </div>
  );
}
