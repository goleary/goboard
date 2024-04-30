import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoBox,
  InfoWindow,
} from "@react-google-maps/api";
import { Place } from "../api/types";

const center = {
  lat: 47.6562527,
  lng: -122.2077014,
};

type MapProps = {
  places: Place[];
};

const MyComponent: React.FC<MapProps> = ({ places }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const [selectedPlace, setSelectedPlace] = React.useState<Place | null>(null);
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "100%",
      }}
      center={center}
      zoom={11}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {map &&
        places.map(
          (place) =>
            place.location && (
              <Marker
                key={place.id}
                onClick={(e) => {
                  setSelectedPlace(place);
                }}
                position={{
                  lat: place.location.latitude,
                  lng: place.location.longitude,
                }}
              />
            )
        )}
      {selectedPlace && (
        <InfoWindow
          position={{
            lat: selectedPlace.location.latitude,
            lng: selectedPlace.location.longitude,
          }}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <a
              className="font-bold text-blue-500 hover:text-blue-400"
              href={`https://www.google.com/maps/place/?q=place_id:${selectedPlace.id}`}
              target="_blank"
            >
              {selectedPlace.displayName.text}
            </a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(MyComponent);
