import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEYY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAINN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_IDD,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_IDD,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Cek apakah app sudah diinisialisasi
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);