// src/firebase/config.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // <--- CAMBIO: Usamos Database

const firebaseConfig = {
  // --- TUS CLAVES REALES AQUÍ (NO LAS TOQUES) ---
  apiKey: "AIzaSyDkG4V4zKRMNHcpaeWRNDIFjwhXgP9YO8Q",
  authDomain: "codelink-af067.firebaseapp.com",
  projectId: "codelink-af067",
  storageBucket: "codelink-af067.firebasestorage.app",
  messagingSenderId: "147375276218",
  appId: "1:147375276218:web:d6040312600790347b8283",
  measurementId: "G-1NDKVXS63B"
};

// Inicializar Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getDatabase(app); // <--- Inicializamos Realtime Database

export { app, auth, db };