'use client';

import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/config';

const TimeBox = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-20 h-24 sm:w-24 sm:h-28 glass-card flex items-center justify-center mb-2 bg-black/20 border-pink-500/20 rounded-2xl">
      <span className="text-4xl sm:text-5xl font-black text-white">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-xs font-bold uppercase tracking-widest text-pink-400">{label}</span>
  </div>
);

export default function CalendarioPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [names, setNames] = useState({ user1: 'Usuario 1', user2: 'Usuario 2' });

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
    <div className="flex flex-col items-center space-y-12 py-10">
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          {names.user1} & {names.user2}
        </h1>
        <p className="text-gray-400 font-medium uppercase tracking-widest text-sm">Tiempo restante para el reencuentro</p>
      </div>

      {targetDate ? (
        <div className="grid grid-cols-4 gap-4 sm:gap-6">
          <TimeBox value={timeLeft.days} label="Días" />
          <TimeBox value={timeLeft.hours} label="Horas" />
          <TimeBox value={timeLeft.minutes} label="Mins" />
          <TimeBox value={timeLeft.seconds} label="Segs" />
        </div>
      ) : (
        <div className="glass-card p-6 text-center rounded-xl">
          <p className="text-gray-300">Configura la fecha en Ajustes</p>
        </div>
      )}

      <div className="w-full max-w-2xl glass-card p-8 relative overflow-hidden rounded-3xl group hover:border-pink-500/30 transition duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
          Tablón Compartido
        </h2>
        <p className="text-gray-400 mb-6 font-light">
          Espacio libre para compartir notas o enlaces.
        </p>
        <div className="flex gap-4">
           <button className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm font-medium text-white border border-white/10">Subir Foto</button>
           <button className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm font-medium text-white border border-white/10">Nueva Nota</button>
        </div>
      </div>
    </div>
  );
}