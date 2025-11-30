'use client';

import React, { useState, useEffect } from 'react';

// --- CONFIGURACIÓN CLAVE ---
// FORMATO: 'YYYY-MM-DDTHH:MM:SS'
const REUNION_DATE = new Date('2026-03-25T18:00:00'); 
// --------------------------

// Componente para el Tablón
const Tablon = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-pink-200">
    <h2 className="text-3xl font-bold text-pink-600 mb-4">✨ Nuestro Espacio Libre ✨</h2>
    <p className="text-gray-600 mb-4">
      Este es nuestro tablón personal. Aquí puedes pegar frases, enlaces a fotos o videos que quieras compartir.
    </p>
    
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Planes para el Reencuentro</h3>
    <a href="https://trello.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">
      Ir al Tablero Compartido (Trello/Notion)
    </a>
  </div>
);

// Componentes auxiliares
const TimeBox = ({ value, label }: { value: number, label: string }) => (
  <div className="w-24 p-3 bg-pink-400 rounded-lg text-white">
    <div className="text-5xl font-extrabold">{String(value).padStart(2, '0')}</div>
    <div className="text-sm font-medium mt-1">{label}</div>
  </div>
);

const CalendarLink = ({ label, href }: { label: string, href: string }) => (
    <a href={href} className="flex-1 text-center block p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition" target="_blank" rel="noopener noreferrer">
        {label}
    </a>
);

// Componente principal de la página
export default function CalendarioPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Lógica del contador regresivo
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = REUNION_DATE.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-900">💖 ¡El Reencuentro se Acerca! 💖</h1>

      {/* 1. CONTADOR REGRESIVO */}
      <div className="text-center bg-pink-100 p-8 rounded-2xl shadow-xl">
        <p className="text-lg font-semibold text-pink-700 mb-4">Faltan...</p>
        <div className="flex justify-center space-x-6 text-gray-900">
          <TimeBox value={timeLeft.days} label="Días" />
          <TimeBox value={timeLeft.hours} label="Horas" />
          <TimeBox value={timeLeft.minutes} label="Minutos" />
          <TimeBox value={timeLeft.seconds} label="Segundos" />
        </div>
      </div>

      {/* 2. TABLÓN LIBRE */}
      <Tablon />
      
      {/* 3. ENLACES A CALENDARIOS */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Enlaces Rápidos (Calendarios Apple)</h2>
          <div className="flex space-x-6">
            <CalendarLink label="Mi Calendario" href="#" />
            <CalendarLink label="Su Calendario" href="#" />
          </div>
      </div>
    </div>
  );
}