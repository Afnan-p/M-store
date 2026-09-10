/**
 * Firebase Service Abstraction Stub
 * 
 * To connect your production Firebase instance:
 * 1. Install firebase package: `npm install firebase`
 * 2. Fill in your Firebase config keys in .env.local:
 *    VITE_FIREBASE_API_KEY=...
 *    VITE_FIREBASE_AUTH_DOMAIN=...
 *    VITE_FIREBASE_PROJECT_ID=...
 * 3. Uncomment initialization below and update ProductService/AuthService to use Firestore & Firebase Auth.
 */

/*
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
*/

export const isFirebaseConfigured = (): boolean => {
  return Boolean(import.meta.env.VITE_FIREBASE_API_KEY);
};
