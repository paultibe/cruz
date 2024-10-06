'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import BlueTextbox from '../components/BlueTextbox';

export default function RidePage() {
  const [userName, setUserName] = useState('');
  const [destination, setDestination] = useState('');
  const [currentView, setCurrentView] = useState('home');
  const [currentLocation, setCurrentLocation] = useState('');

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
  }, []);

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
              placeholder="current location"
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
