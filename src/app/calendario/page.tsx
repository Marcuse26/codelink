'use client';
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/config';

export default function CalendarioPage() {
  const [days, setDays] = useState(0);
  const [targetDate, setTargetDate] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'settings'), (snap) => {
      if (snap.val()?.reunionDate) setTargetDate(snap.val().reunionDate);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!targetDate) return;
    const calc = () => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div className="space-y-8 py-6 text-center">
      <div className="bg-pink-500/10 p-8 rounded-full w-64 h-64 mx-auto flex flex-col justify-center items-center border-4 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)]">
        <span className="text-6xl font-bold text-white">{days}</span>
        <span className="text-pink-300 uppercase tracking-widest font-bold">Días</span>
        <p className="text-xs text-pink-200 mt-2">Para vernos</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a href="https://icloud.com" className="p-4 bg-white/10 rounded-xl hover:bg-white/20">📅 Mi Calendario</a>
        <a href="https://icloud.com" className="p-4 bg-white/10 rounded-xl hover:bg-white/20">📅 Su Calendario</a>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left">
        <h3 className="font-bold text-white mb-4">Tablón Libre 📌</h3>
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-200 p-3 rounded text-black font-handwriting -rotate-2">Ver peli el viernes 🎬</div>
            <div className="bg-blue-200 p-3 rounded text-black font-handwriting rotate-1">¡Te quiero! ❤️</div>
        </div>
      </div>
    </div>
  );
}