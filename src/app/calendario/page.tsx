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

  // Helper para añadir el cero delante (05, 09...)
  const f = (n: number) => n < 10 ? `0${n}` : n;

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10 w-full">
      
      {/* Título */}
      <h1 className="text-3xl font-black text-gray-800 uppercase tracking-widest text-center">
        Tiempo Restante
      </h1>

      {/* CONTADOR REDISEÑADO */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-200 p-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
        
        {/* PARTE SUPERIOR: DÍAS (Con texto) */}
        <div className="flex flex-col items-center mb-6">
            <span className="text-9xl font-black text-gray-900 leading-none tracking-tighter">
                {timeLeft.days}
            </span>
            <span className="text-xl font-bold text-gray-400 tracking-[0.5em] uppercase mt-4 pl-2">
                Días
            </span>
        </div>

        {/* Separador */}
        <div className="w-1/2 h-1 bg-gray-100 rounded-full mb-8"></div>

        {/* PARTE INFERIOR: RELOJ DIGITAL (Solo números) */}
        <div className="flex items-end gap-2 md:gap-4">
            
            {/* Horas */}
            <span className="text-5xl md:text-6xl font-bold text-gray-800 tabular-nums leading-none">
                {f(timeLeft.hours)}
            </span>

            <span className="text-4xl md:text-5xl text-gray-300 pb-1 leading-none">:</span>

            {/* Minutos */}
            <span className="text-5xl md:text-6xl font-bold text-gray-800 tabular-nums leading-none">
                {f(timeLeft.minutes)}
            </span>

            <span className="text-4xl md:text-5xl text-gray-300 pb-1 leading-none">:</span>

            {/* Segundos */}
            <span className="text-5xl md:text-6xl font-bold text-gray-800 tabular-nums leading-none">
                {f(timeLeft.seconds)}
            </span>

        </div>
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
            <div className="overflow-hidden">
                <span className="block font-bold text-gray-800 text-lg truncate">Calendario de {config.user1}</span>
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
            <div className="overflow-hidden">
                <span className="block font-bold text-gray-800 text-lg truncate">Calendario de {config.user2}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Ver Planificación</span>
            </div>
        </a>
      </div>

    </div>
  );
}