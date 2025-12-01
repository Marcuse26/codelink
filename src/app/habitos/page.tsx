'use client';

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
// Usamos datos dummy si no hay datos reales
import { habitosData } from '../../data/habitos';

const PorcentajeInput = ({ label, initialValue, color }: { label: string, initialValue: number, color: string }) => {
    const [percentage, setPercentage] = useState(initialValue);
    
    // Aquí iría la lógica para guardar en Firebase
    const handleChange = (val: string) => {
        const num = Math.min(100, Math.max(0, Number(val)));
        setPercentage(num);
    };

    return (
        <div className={`glass-card p-6 rounded-2xl border-t-4 ${color === 'blue' ? 'border-blue-500' : 'border-pink-500'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${color === 'blue' ? 'text-blue-400' : 'text-pink-400'}`}>{label}</h3>
            <div className="flex items-end gap-2">
                <input 
                    type="number" 
                    value={percentage} 
                    onChange={(e) => handleChange(e.target.value)} 
                    className="w-24 bg-black/30 border border-white/10 text-4xl font-bold text-white rounded-xl p-2 text-center focus:outline-none focus:border-white/30" 
                />
                <span className="text-xl text-gray-500 font-bold mb-2">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Cumplimiento hoy</p>
        </div>
    );
};

export default function HabitosPage() {
  return (
    <div className="space-y-10 py-6">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
          ✅ Hábitos y Bienestar
        </h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest">Construyendo disciplina juntos</p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <PorcentajeInput label="Mi Progreso" initialValue={75} color="blue" />
        <PorcentajeInput label="Su Progreso" initialValue={90} color="pink" />
      </div>

      <div className="glass-card p-6 rounded-3xl h-96 relative">
        <h2 className="text-white font-bold mb-6 flex items-center gap-2">
            <span className="text-xl">📈</span> Tendencia Semanal
        </h2>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={habitosData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="dia" stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
            <YAxis domain={[0, 100]} stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line type="monotone" dataKey="yo" stroke="#3b82f6" strokeWidth={4} name="Yo" dot={{fill: '#3b82f6', r: 4}} activeDot={{r: 8}} />
            <Line type="monotone" dataKey="ella" stroke="#ec4899" strokeWidth={4} name="Ella" dot={{fill: '#ec4899', r: 4}} activeDot={{r: 8}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}