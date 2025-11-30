// src/firebase/config.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // SUSTITUYE ESTO CON LOS DATOS QUE COPIASTE DE LA CONSOLA DE FIREBASE
  apiKey: "AIzaSy...",
  authDomain: "codelink-....firebaseapp.com",
  projectId: "codelink-...",
  storageBucket: "codelink-....appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Inicializar Firebase solo si no existe ya
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };