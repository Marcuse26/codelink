'use client';

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
// CORRECCIÓN: Usamos ruta relativa
import { habitosData } from '../../data/habitos';

const PorcentajeInput = ({ label, initialValue, color }: { label: string, initialValue: number, color: string }) => {
    const [percentage, setPercentage] = useState(initialValue);
    return (
        <div className={`p-4 rounded-lg shadow-md border-t-4 border-${color}-500 bg-white`}>
            <h3 className="text-xl font-semibold mb-3" style={{ color: color }}>{label}</h3>
            <div className="flex items-center space-x-2">
                <input type="number" value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} className="w-20 p-2 border border-gray-300 rounded text-center text-lg" />
                <span className="text-2xl font-bold">%</span>
            </div>
        </div>
    );
};

export default function HabitosPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-900">✅ Progreso de Hábitos Diarios</h1>
      <div className="flex justify-around items-start">
        <PorcentajeInput label="Mi Porcentaje Hoy" initialValue={75} color="blue" />
        <PorcentajeInput label="Su Porcentaje Hoy" initialValue={90} color="red" />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-xl h-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tendencia Semanal</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={habitosData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="dia" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="yo" stroke="#3b82f6" strokeWidth={3} name="Yo" />
            <Line type="monotone" dataKey="ella" stroke="#ef4444" strokeWidth={3} name="Ella" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}