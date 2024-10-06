'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import BlueTextbox from '../components/BlueTextbox';
import { Loader } from "@googlemaps/js-api-loader";

export default function RidePage() {
  const [userName, setUserName] = useState('');
  const [destination, setDestination] = useState('');
  const [currentView, setCurrentView] = useState('home');
  const [currentLocation, setCurrentLocation] = useState('');
  const destinationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name || '');
        }
      }
    };

    fetchUserName();

    // Initialize Google Places Autocomplete
    const initAutocomplete = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"],
      });

      const { Autocomplete } = await loader.importLibrary("places");

      if (destinationInputRef.current) {
        const autocomplete = new Autocomplete(destinationInputRef.current, {
          fields: ["place_id", "geometry", "name"],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          setDestination(place.name || '');
        });
      }
    };

    initAutocomplete();
  }, []);

  useEffect(() => {
    if (currentView === 'location') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log('Current position:', currentPosition);
            
            // Use Google Maps Geocoding API to get a human-readable address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: currentPosition }, (results, status) => {
              if (status === 'OK' && results[0]) {
                setCurrentLocation(results[0].formatted_address);
              } else {
                console.error('Geocoder failed due to: ' + status);
                setCurrentLocation(`${currentPosition.lat}, ${currentPosition.lng}`);
              }
            });
          },
          (error) => {
            console.error('Error getting current position:', error);
            setCurrentLocation('Unable to get current location');
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setCurrentLocation('Geolocation not supported');
      }
    }
  }, [currentView]);

  const handleDestinationSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentView('location');
    }
  };

  const handleCheckButtonClick = () => {
    setCurrentView('mode');
  };

  return (
    <div className="relative w-[393px] h-[852px]">
      <Image
        src={
          currentView === 'home'
            ? "/assets/home.png"
            : currentView === 'location'
            ? "/assets/location.png"
            : "/assets/mode.png"
        }
        alt={
          currentView === 'home'
            ? "Home"
            : currentView === 'location'
            ? "Location"
            : "Mode"
        }
        layout="fill"
        objectFit="cover"
        priority
      />
      {currentView === 'home' && (
        <>
          <div className="absolute top-[62px] left-6 text-black text-3xl font-bold z-10">
            Hi {userName}!
          </div>
          <div className="absolute top-[110px] left-6 z-10">
            <div className="relative">
              <Image
                src="/assets/where-to.png"
                alt="Where to?"
                width={340}
                height={50}
              />
              <input
                ref={destinationInputRef}
                type="text"
                placeholder="where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyPress={handleDestinationSubmit}
                className="absolute inset-0 bg-transparent border-none outline-none pl-12 text-white placeholder-white"
              />
            </div>
          </div>
        </>
      )}
      {currentView === 'location' && (
        <>
          <div className="absolute top-[53%] left-[55%] transform -translate-x-1/2 flex flex-col items-center space-y-4 z-10">
            <BlueTextbox
              givenText={currentLocation}
              onChange={(value) => setCurrentLocation(value)}
            />
            <BlueTextbox
              givenText={destination}
              onChange={(value) => setDestination(value)}
            />
          </div>
          <div className="absolute bottom-[16%] right-[10%] z-10">
            <button onClick={handleCheckButtonClick}>
              <Image
                src="/assets/checkbutton.png"
                alt="Check Button"
                width={70}
                height={70}
              />
            </button>
          </div>
        </>
      )}
      {currentView === 'mode' && (
        <div className="absolute top-[8.5%] left-[55%] transform -translate-x-1/2 flex flex-col items-center space-y-4 z-10">
          <BlueTextbox
            givenText={currentLocation}
            onChange={(value) => setCurrentLocation(value)}
          />
          <BlueTextbox
            givenText={destination}
            onChange={(value) => setDestination(value)}
          />
        </div>
      )}
    </div>
  );
}
