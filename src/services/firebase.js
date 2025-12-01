import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config - hardcoded for production deployment
// Firebase API keys are safe to expose in client-side code (Google Firebase docs)
const firebaseConfig = {
  apiKey: "AIzaSyBVgXHTbDYxMszamSv-p_x-LD6EvfDjZFg",
  authDomain: "sword-drill.firebaseapp.com",
  projectId: "sword-drill",
  storageBucket: "sword-drill.firebasestorage.app",
  messagingSenderId: "350800984953",
  appId: "1:350800984953:web:5788bc5072d4ca35db8da8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
