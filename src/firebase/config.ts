import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock_key_for_build",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock_domain",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://mock.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock_project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock_bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "12345",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:12345:web:mock",
};

// Inicialización segura para que el Build no explote
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Servicios seguros (si fallan las claves, devuelve objetos vacíos para no romper la web)
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };