'use client';

import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/config';

const TimeBox = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-20 sm:w-20 sm:h-24 glass-card flex items-center justify-center mb-2 bg-black/40 border-pink-500/30 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.15)]">
      <span className="text-3xl sm:text-4xl font-black text-white font-mono">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-pink-300">{label}</span>
  </div>
);

export default function CalendarioPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [names, setNames] = useState({ user1: '...', user2: '...' });

  useEffect(() => {
    const settingsRef = ref(db, 'settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTargetDate(data.reunionDate);
        setNames({ user1: data.user1 || 'Usuario 1', user2: data.user2 || 'Usuario 2' });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const reunion = new Date(targetDate).getTime();
      const distance = reunion - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center space-y-12 py-6">
      
      <header className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-3">
          {names.user1} <span className="text-pink-500">♥</span> {names.user2}
        </h1>
        <div className="inline-block px-4 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-widest">
            Cuenta Regresiva
        </div>
      </header>

      {targetDate ? (
        <div className="grid grid-cols-4 gap-3 sm:gap-6">
          <TimeBox value={timeLeft.days} label="Días" />
          <TimeBox value={timeLeft.hours} label="Hrs" />
          <TimeBox value={timeLeft.minutes} label="Min" />
          <TimeBox value={timeLeft.seconds} label="Seg" />
        </div>
      ) : (
        <div className="glass-card p-6 text-center rounded-xl border-dashed border-2 border-gray-600">
          <p className="text-gray-400">📅 Configura la fecha en Ajustes</p>
        </div>
      )}

      {/* Links a Apple Calendar */}
      <div className="flex gap-4 w-full max-w-lg">
        <a href="https://www.icloud.com/calendar/" target="_blank" className="flex-1 glass-card p-4 rounded-xl text-center hover:bg-white/10 transition group">
            <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">📅</span>
            <span className="text-xs font-bold uppercase text-gray-400">Mi Calendario</span>
        </a>
        <a href="https://www.icloud.com/calendar/" target="_blank" className="flex-1 glass-card p-4 rounded-xl text-center hover:bg-white/10 transition group">
            <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">📅</span>
            <span className="text-xs font-bold uppercase text-gray-400">Su Calendario</span>
        </a>
      </div>

      {/* Tablón Multimedia */}
      <div className="w-full max-w-3xl glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full"></div>
        
        <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Muro de Conexión</h2>
                <p className="text-gray-400 text-sm">Espacio libre para notas, fotos y planes futuros.</p>
            </div>
            <div className="flex gap-2">
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition">📝 Nota</button>
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition">📸 Foto</button>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
            {/* Ejemplo de items (Sticky Notes) */}
            <div className="aspect-square bg-yellow-200/90 text-black p-4 rounded-xl shadow-lg rotate-1 transform hover:rotate-0 transition duration-300">
                <p className="font-handwriting text-sm font-bold">¡Planear viaje a la playa! 🏖️</p>
            </div>
            <div className="aspect-square bg-pink-200/90 text-black p-4 rounded-xl shadow-lg -rotate-2 transform hover:rotate-0 transition duration-300 flex items-center justify-center">
                <p className="text-2xl">💖</p>
            </div>
            <div className="aspect-square bg-blue-200/90 text-black p-4 rounded-xl shadow-lg rotate-2 transform hover:rotate-0 transition duration-300">
                <p className="font-handwriting text-sm font-bold">Ver peli el viernes 🎬</p>
            </div>
        </div>
      </div>
    </div>
  );
}