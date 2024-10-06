'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleAuth = async (isSignUp: boolean) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;
      console.log(isSignUp ? 'User signed up:' : 'User logged in:', user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during Google authentication:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative">
        {isLoggedIn ? (
          <Image src="/assets/full-name.png" alt="Full Name" width={500} height={300} />
        ) : (
          <>
            <Image src="/assets/sign-in.png" alt="Sign In" width={500} height={300} />
            <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center">
              <button className="mb-3 scale-125 -translate-x-1 -translate-y-12" onClick={() => handleGoogleAuth(false)}>
                <Image src="/assets/continue-with-google.png" alt="Continue with Google" width={240} height={65} />
              </button>
              <button className="scale-125 -translate-x-1 translate-y-5" onClick={() => handleGoogleAuth(true)}>
                <Image src="/assets/sign-up-with-google.png" alt="Sign up with Google" width={240} height={65} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



