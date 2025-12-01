// src/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDkG4V4zKRMNHcpaeWRNDIFjwhXgP9YO8Q",
  authDomain: "codelink-af067.firebaseapp.com",
  projectId: "codelink-af067",
  storageBucket: "codelink-af067.firebasestorage.app",
  messagingSenderId: "147375276218",
  appId: "1:147375276218:web:d6040312600790347b8283",
  measurementId: "G-1NDKVXS63B"
};


// Inicializar Firebase (evita reinicializar si ya existe)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };