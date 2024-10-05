// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlbPSv1Vd0eEzXzWaWRLRNlOz-dyxgi3U",
  authDomain: "cruz-3c3c4.firebaseapp.com",
  projectId: "cruz-3c3c4",
  storageBucket: "cruz-3c3c4.appspot.com",
  messagingSenderId: "753797296187",
  appId: "1:753797296187:web:925ea0b73ecdde88322c1e",
  measurementId: "G-92K9F9XL59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, auth };