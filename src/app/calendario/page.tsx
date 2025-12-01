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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [config.reunionDate]);

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-10 w-full">
      
      {/* Título */}
      <h1 className="text-3xl font-black text-gray-800 uppercase tracking-widest text-center">
        Tiempo Restante
      </h1>

      {/* CONTADOR HORIZONTAL PREMIUM */}
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-8 flex flex-wrap md:flex-nowrap items-center justify-center gap-4 md:gap-0 w-full max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
        
        <TimeUnit value={timeLeft.days} label="Días" />
        <Separator />
        <TimeUnit value={timeLeft.hours} label="Horas" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} label="Minutos" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} label="Segundos" isLast />

      </div>

      {/* ENLACES A CALENDARIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-4 mt-8">
        <a 
            href={config.calendarUrl1 || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
            <div className="bg-blue-100 p-3 rounded-xl text-2xl group-hover:scale-110 transition-transform">📅</div>
            <div>
                <span className="block font-bold text-gray-800 text-lg">Calendario de {config.user1}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Ver Planificación</span>
            </div>
        </a>

        <a 
            href={config.calendarUrl2 || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
            <div className="bg-pink-100 p-3 rounded-xl text-2xl group-hover:scale-110 transition-transform">📅</div>
            <div>
                <span className="block font-bold text-gray-800 text-lg">Calendario de {config.user2}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Ver Planificación</span>
            </div>
        </a>
      </div>

    </div>
  );
}

// --- Componentes Auxiliares ---

const TimeUnit = ({ value, label, isLast }: { value: number, label: string, isLast?: boolean }) => (
    <div className="flex flex-col items-center px-4 md:px-8 py-2 min-w-[120px]">
        <span className="text-5xl md:text-7xl font-black bg-gradient-to-b from-gray-800 to-gray-600 bg-clip-text text-transparent tabular-nums leading-none tracking-tight">
            {value < 10 ? `0${value}` : value}
        </span>
        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-3">
            {label}
        </span>
    </div>
);

const Separator = () => (
    <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-gray-200 to-transparent mx-2"></div>
);