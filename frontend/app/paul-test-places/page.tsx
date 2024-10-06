"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const Page = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"],
      });

      const { Map } = await loader.importLibrary("maps");
      const { Autocomplete } = await loader.importLibrary("places");

      if (mapRef.current) {
        const newMap = new Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          mapId: "MY_NEXTJS_MAPID",
        });
        setMap(newMap);

        // Get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              newMap.setCenter(currentLocation);
              newMap.setZoom(15);

              // Add a blue pin to mark the current location
              new google.maps.Marker({
                position: currentLocation,
                map: newMap,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                },
              });
            },
            () => {
              console.error("Error: The Geolocation service failed.");
            }
          );
        }

        const newDirectionsService = new google.maps.DirectionsService();
        const newDirectionsRenderer = new google.maps.DirectionsRenderer();
        newDirectionsRenderer.setMap(newMap);
        setDirectionsService(newDirectionsService);
        setDirectionsRenderer(newDirectionsRenderer);

        // Setup autocomplete for pickup and dropoff inputs
        [pickupInputRef, dropoffInputRef].forEach((inputRef) => {
          if (inputRef.current) {
            const autocomplete = new Autocomplete(inputRef.current, {
              fields: ["place_id", "geometry", "name"],
            });
          }
        });
      }
    };

    initMap();
  }, []);

  const handleRequest = () => {
    if (directionsService && directionsRenderer && pickupInputRef.current && dropoffInputRef.current) {
      const request: google.maps.DirectionsRequest = {
        origin: pickupInputRef.current.value,
        destination: dropoffInputRef.current.value,
        travelMode: google.maps.TravelMode.BICYCLING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
        }
      });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div ref={mapRef} className="w-full h-64 mb-4 rounded-lg shadow-md"></div>
      <input
        ref={pickupInputRef}
        type="text"
        placeholder="Pickup location"
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        ref={dropoffInputRef}
        type="text"
        placeholder="Dropoff location"
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        onClick={handleRequest}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        Request
      </button>
    </div>
  );
};

export default Page;
