'use client';
import React from 'react';

export default function DeportePage() {
  return (
    <div className="space-y-8 py-6 text-center">
      <h1 className="text-3xl font-bold text-white">🏃 Strava & Racha</h1>
      
      <div className="bg-orange-500/20 p-8 rounded-3xl border border-orange-500/50">
        <p className="text-orange-300 uppercase text-sm font-bold">Racha Conjunta</p>
        <p className="text-7xl font-black text-white my-2">19</p>
        <p className="text-white/60 text-sm">Días seguidos entrenando</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-xl border-l-4 border-blue-500">
            <h3 className="text-white font-bold">Yo</h3>
            <button className="mt-2 w-full py-2 bg-blue-600 rounded text-white text-sm font-bold">🔥 Activar</button>
        </div>
        <div className="bg-white/5 p-4 rounded-xl border-l-4 border-pink-500">
            <h3 className="text-white font-bold">Ella</h3>
            <button className="mt-2 w-full py-2 bg-pink-600 rounded text-white text-sm font-bold">🔥 Activar</button>
        </div>
      </div>
    </div>
  );
}