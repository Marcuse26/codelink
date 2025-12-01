'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../firebase/config';

// --- Helpers de Fechas ---
const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
  return new Date(d.setDate(diff));
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function HabitosPage() {
  const [names, setNames] = useState({ user1: 'Usuario 1', user2: 'Usuario 2' });
  const [todayValues, setTodayValues] = useState({ user1: 0, user2: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  
  const todayStr = getTodayString();

  // 1. Cargar Nombres
  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'settings'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNames({
          user1: data.user1 || 'Usuario 1',
          user2: data.user2 || 'Usuario 2'
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Cargar Datos y Construir Gráfica
  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'habits'), (snapshot) => {
      const allHabits = snapshot.val() || {};
      
      // A. Valores de HOY (Aseguramos que sean números para quitar ceros delante)
      if (allHabits[todayStr]) {
        setTodayValues({
          user1: Number(allHabits[todayStr].user1 || 0),
          user2: Number(allHabits[todayStr].user2 || 0)
        });
      } else {
        setTodayValues({ user1: 0, user2: 0 });
      }

      // B. Datos Semanales
      const startOfWeek = getStartOfWeek(new Date());
      const weekData = [];

      for (let i = 0; i < 7; i++) {
        const current = new Date(startOfWeek);
        current.setDate(startOfWeek.getDate() + i);
        const dateKey = formatDate(current);
        const dayData = allHabits[dateKey] || { user1: 0, user2: 0 };

        weekData.push({
          dia: weekDays[i],
          // Importante: Convertir a Number para que la gráfica funcione
          [names.user1]: Number(dayData.user1 || 0),
          [names.user2]: Number(dayData.user2 || 0),
        });
      }
      setChartData(weekData);
    });

    return () => unsubscribe();
  }, [todayStr, names]);

  // 3. Manejar cambios (Input)
  const handleInputChange = (userKey: 'user1' | 'user2', value: string) => {
    let numVal = parseInt(value);
    
    // Si el campo está vacío o es inválido, tratamos como 0 temporalmente o mantenemos vacío
    if (value === '') numVal = 0; 
    else if (isNaN(numVal)) numVal = 0;
    
    // Límites
    if (numVal < 0) numVal = 0;
    if (numVal > 100) numVal = 100;

    const newValues = { ...todayValues, [userKey]: numVal };
    setTodayValues(newValues);

    // Guardar en DB
    update(ref(db, `habits/${todayStr}`), newValues);
  };

  return (
    <div className="space-y-8 py-6">
      <h1 className="text-3xl font-bold text-white text-center">✅ Hábitos Diarios</h1>
      
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        {/* Usuario 1 */}
        <div className="bg-blue-900/30 p-6 rounded-2xl border border-blue-500/30 text-center flex flex-col justify-center shadow-lg backdrop-blur-sm">
            <p className="text-blue-300 font-bold uppercase tracking-wider mb-2">{names.user1}</p>
            <div className="relative w-full max-w-[120px] mx-auto">
                <input 
                    type="number" 
                    min="0" 
                    max="100"
                    // Convertimos a Number para renderizar (elimina ceros a la izquierda visualmente)
                    value={Number(todayValues.user1).toString()} 
                    onChange={(e) => handleInputChange('user1', e.target.value)}
                    className="bg-transparent text-5xl font-black text-white w-full text-center outline-none border-b-2 border-blue-500/50 focus:border-blue-400 transition-all py-2" 
                />
                <span className="absolute top-2 right-[-10px] text-lg text-blue-400/50">%</span>
            </div>
            <span className="text-xs text-gray-400 mt-2 font-medium">Progreso Hoy</span>
        </div>

        {/* Usuario 2 */}
        <div className="bg-pink-900/30 p-6 rounded-2xl border border-pink-500/30 text-center flex flex-col justify-center shadow-lg backdrop-blur-sm">
            <p className="text-pink-300 font-bold uppercase tracking-wider mb-2">{names.user2}</p>
            <div className="relative w-full max-w-[120px] mx-auto">
                <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={Number(todayValues.user2).toString()} 
                    onChange={(e) => handleInputChange('user2', e.target.value)}
                    className="bg-transparent text-5xl font-black text-white w-full text-center outline-none border-b-2 border-pink-500/50 focus:border-pink-400 transition-all py-2" 
                />
                <span className="absolute top-2 right-[-10px] text-lg text-pink-400/50">%</span>
            </div>
            <span className="text-xs text-gray-400 mt-2 font-medium">Progreso Hoy</span>
        </div>
      </div>

      {/* Gráfica */}
      <div className="glass-card p-6 rounded-2xl min-h-[400px]">
        <h3 className="text-white font-bold mb-6 px-2 border-l-4 border-purple-500 pl-3">Evolución Semanal</h3>
        <div className="h-80 w-full">
          {/* Key fuerza re-render si cambian los nombres */}
          <ResponsiveContainer width="100%" height="100%" key={JSON.stringify(names)}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="dia" 
                stroke="#888" 
                tick={{fill: '#9ca3af'}} 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis 
                stroke="#888" 
                domain={[0, 100]} 
                tick={{fill: '#9ca3af'}} 
                axisLine={false} 
                tickLine={false}
                width={30}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              <Line 
                name={names.user1}
                type="monotone" 
                dataKey={names.user1} 
                stroke="#3b82f6" 
                strokeWidth={4} 
                dot={{r: 4, fill: '#1d4ed8', strokeWidth: 2, stroke: '#fff'}}
                activeDot={{r: 6}}
                animationDuration={500}
              />
              <Line 
                name={names.user2}
                type="monotone" 
                dataKey={names.user2} 
                stroke="#ec4899" 
                strokeWidth={4} 
                dot={{r: 4, fill: '#be185d', strokeWidth: 2, stroke: '#fff'}}
                activeDot={{r: 6}}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}