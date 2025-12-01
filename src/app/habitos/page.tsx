'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../firebase/config';

// --- Helpers ---
const getTodayString = () => new Date().toISOString().split('T')[0];

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function HabitosPage() {
  const [names, setNames] = useState({ user1: 'Usuario 1', user2: 'Usuario 2' });
  const [todayValues, setTodayValues] = useState({ user1: 0, user2: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  
  const todayStr = getTodayString();

  // 1. Cargar Nombres y Datos
  useEffect(() => {
    // Escuchar nombres
    const unsubNames = onValue(ref(db, 'settings'), (snapshot) => {
      const data = snapshot.val();
      if (data) setNames({ user1: data.user1, user2: data.user2 });
    });

    // Escuchar hábitos
    const unsubHabits = onValue(ref(db, 'habits'), (snapshot) => {
      const allHabits = snapshot.val() || {};
      
      // Valores de hoy
      if (allHabits[todayStr]) {
        setTodayValues({
          user1: Number(allHabits[todayStr].user1 || 0),
          user2: Number(allHabits[todayStr].user2 || 0)
        });
      } else {
        setTodayValues({ user1: 0, user2: 0 });
      }

      // Generar datos de la semana
      const startOfWeek = getStartOfWeek(new Date());
      const weekData = [];

      for (let i = 0; i < 7; i++) {
        const current = new Date(startOfWeek);
        current.setDate(startOfWeek.getDate() + i);
        const dateKey = formatDate(current);
        const dayData = allHabits[dateKey] || { user1: 0, user2: 0 };

        weekData.push({
          name: weekDays[i],
          val1: Number(dayData.user1 || 0), // Usamos claves fijas internamente
          val2: Number(dayData.user2 || 0),
        });
      }
      setChartData(weekData);
    });

    return () => { unsubNames(); unsubHabits(); };
  }, [todayStr]);

  // 2. Manejar Inputs
  const handleInputChange = (userKey: 'user1' | 'user2', value: string) => {
    // Si borran todo, dejar cadena vacía para que no ponga 0 agresivamente
    if (value === '') {
       // @ts-ignore
       setTodayValues(prev => ({ ...prev, [userKey]: '' }));
       return;
    }

    let numVal = parseInt(value);
    if (isNaN(numVal)) numVal = 0;
    if (numVal < 0) numVal = 0;
    if (numVal > 100) numVal = 100;

    const newValues = { 
        user1: userKey === 'user1' ? numVal : Number(todayValues.user1 || 0),
        user2: userKey === 'user2' ? numVal : Number(todayValues.user2 || 0)
    };
    
    setTodayValues(newValues);
    update(ref(db, `habits/${todayStr}`), newValues);
  };

  return (
    <div className="space-y-8 py-6">
      <h1 className="text-3xl font-bold text-white text-center">✅ Hábitos Diarios</h1>
      
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-6">
        {/* Input 1 */}
        <div className="bg-[#1e1b4b] p-6 rounded-3xl border border-blue-500/40 text-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <p className="text-blue-300 font-bold uppercase tracking-wider text-sm mb-3">{names.user1}</p>
            <div className="relative w-fit mx-auto">
                <input 
                    type="number" 
                    value={todayValues.user1.toString()} 
                    onChange={(e) => handleInputChange('user1', e.target.value)}
                    className="bg-transparent text-6xl font-black text-white w-32 text-center outline-none focus:scale-110 transition-transform" 
                />
                <span className="absolute top-0 -right-4 text-xl text-blue-500">%</span>
            </div>
        </div>

        {/* Input 2 */}
        <div className="bg-[#500724] p-6 rounded-3xl border border-pink-500/40 text-center shadow-[0_0_20px_rgba(236,72,153,0.2)]">
            <p className="text-pink-300 font-bold uppercase tracking-wider text-sm mb-3">{names.user2}</p>
            <div className="relative w-fit mx-auto">
                <input 
                    type="number" 
                    value={todayValues.user2.toString()} 
                    onChange={(e) => handleInputChange('user2', e.target.value)}
                    className="bg-transparent text-6xl font-black text-white w-32 text-center outline-none focus:scale-110 transition-transform" 
                />
                <span className="absolute top-0 -right-4 text-xl text-pink-500">%</span>
            </div>
        </div>
      </div>

      {/* Gráfica PROFESIONAL */}
      <div className="bg-[#1a1a2e] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <h3 className="text-white font-bold mb-6 text-lg pl-2 border-l-4 border-purple-500">Progreso Semanal</h3>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUser1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUser2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              
              <YAxis 
                stroke="#6b7280" 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    color: '#fff'
                }} 
              />
              
              <Legend verticalAlign="top" height={36} iconType="circle" />

              <Area 
                name={names.user1}
                type="monotone" 
                dataKey="val1" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUser1)" 
                animationDuration={1000}
              />
              
              <Area 
                name={names.user2}
                type="monotone" 
                dataKey="val2" 
                stroke="#ec4899" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUser2)" 
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}