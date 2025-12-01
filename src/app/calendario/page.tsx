'use client';
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/config';

export default function CalendarioPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [config, setConfig] = useState({ 
    reunionDate: '', 
    user1: 'Usuario 1', 
    user2: 'Usuario 2',
    calendarUrl1: '#',
    calendarUrl2: '#'
  });

  // 1. Cargar Configuración
  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'settings'), (snap) => {
      const data = snap.val();
      if (data) setConfig(data);
    });
    return () => unsubscribe();
  }, []);

  // 2. Lógica del Contador
  useEffect(() => {
    if (!config.reunionDate) return;

    const calculateTime = () => {
      const difference = +new Date(config.reunionDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Si ya pasó la fecha, todo a 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [config.reunionDate]);

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-10">
      
      {/* Título */}
      <h1 className="text-3xl font-black text-gray-800 uppercase tracking-widest text-center">
        Cuenta Atrás
      </h1>

      {/* CONTADOR GRANDE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl px-4">
        <TimeBox value={timeLeft.days} label="Días" color="bg-blue-100 text-blue-600" />
        <TimeBox value={timeLeft.hours} label="Horas" color="bg-pink-100 text-pink-600" />
        <TimeBox value={timeLeft.minutes} label="Minutos" color="bg-purple-100 text-purple-600" />
        <TimeBox value={timeLeft.seconds} label="Segundos" color="bg-orange-100 text-orange-600" />
      </div>

      {/* ENLACES A CALENDARIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4 mt-8">
        <a 
            href={config.calendarUrl1 || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:scale-105 transition-transform group"
        >
            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📅</span>
            <span className="font-bold text-gray-700">Calendario de {config.user1}</span>
            <span className="text-xs text-gray-400 mt-1">Ver planificación</span>
        </a>

        <a 
            href={config.calendarUrl2 || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:scale-105 transition-transform group"
        >
            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📅</span>
            <span className="font-bold text-gray-700">Calendario de {config.user2}</span>
            <span className="text-xs text-gray-400 mt-1">Ver planificación</span>
        </a>
      </div>

    </div>
  );
}

// Componente auxiliar para las cajas de tiempo
const TimeBox = ({ value, label, color }: { value: number, label: string, color: string }) => (
    <div className={`flex flex-col items-center justify-center p-6 rounded-3xl shadow-sm ${color} transition-all duration-300 hover:shadow-md`}>
        <span className="text-5xl md:text-6xl font-black tabular-nums">
            {value < 10 ? `0${value}` : value}
        </span>
        <span className="text-xs md:text-sm font-bold uppercase tracking-widest mt-2 opacity-80">
            {label}
        </span>
    </div>
);