'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../firebase/config';

// ... (Helpers y weekDays se mantienen igual)
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
  // ... (Toda la lógica de estados y useEffect igual)
  const [config, setConfig] = useState({ 
    user1: 'Usuario 1', 
    user2: 'Usuario 2', 
    color1: '#3b82f6', 
    color2: '#ec4899' 
  });
  const [todayValues, setTodayValues] = useState({ user1: 0, user2: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const todayStr = getTodayString();

  useEffect(() => {
    const unsubConfig = onValue(ref(db, 'settings'), (snapshot) => {
      const data = snapshot.val();
      if (data) setConfig({
            user1: data.user1 || 'Usuario 1',
            user2: data.user2 || 'Usuario 2',
            color1: data.color1 || '#3b82f6',
            color2: data.color2 || '#ec4899'
      });
    });
    const unsubHabits = onValue(ref(db, 'habits'), (snapshot) => {
      const allHabits = snapshot.val() || {};
      if (allHabits[todayStr]) {
        setTodayValues({
          user1: Number(allHabits[todayStr].user1 || 0),
          user2: Number(allHabits[todayStr].user2 || 0)
        });
      } else {
        setTodayValues({ user1: 0, user2: 0 });
      }
      const startOfWeek = getStartOfWeek(new Date());
      const weekData = [];
      for (let i = 0; i < 7; i++) {
        const current = new Date(startOfWeek);
        current.setDate(startOfWeek.getDate() + i);
        const dateKey = formatDate(current);
        const dayData = allHabits[dateKey] || { user1: 0, user2: 0 };
        weekData.push({
          name: weekDays[i],
          val1: Number(dayData.user1 || 0),
          val2: Number(dayData.user2 || 0),
        });
      }
      setChartData(weekData);
    });
    return () => { unsubConfig(); unsubHabits(); };
  }, [todayStr]);

  const handleInputChange = (userKey: 'user1' | 'user2', value: string) => {
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
      <h1 className="text-3xl font-bold text-gray-800 text-center uppercase">HÁBITOS DIARIOS</h1>
      
      {/* CAMBIO AQUI: grid-cols-1 para móvil, md:grid-cols-2 para escritorio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#fdfbf7] p-6 rounded-3xl border border-gray-200 text-center shadow-lg" style={{ borderColor: `${config.color1}40`, boxShadow: `0 4px 20px ${config.color1}15` }}>
            <p className="font-bold uppercase tracking-wider text-sm mb-3" style={{ color: config.color1 }}>{config.user1}</p>
            <div className="relative w-fit mx-auto">
                <input type="number" value={todayValues.user1.toString()} onChange={(e) => handleInputChange('user1', e.target.value)} className="bg-transparent text-6xl font-black text-gray-800 w-32 text-center outline-none focus:scale-110 transition-transform" />
                <span className="absolute top-0 -right-4 text-xl" style={{ color: config.color1 }}>%</span>
            </div>
        </div>
        <div className="bg-[#fdfbf7] p-6 rounded-3xl border border-gray-200 text-center shadow-lg" style={{ borderColor: `${config.color2}40`, boxShadow: `0 4px 20px ${config.color2}15` }}>
            <p className="font-bold uppercase tracking-wider text-sm mb-3" style={{ color: config.color2 }}>{config.user2}</p>
            <div className="relative w-fit mx-auto">
                <input type="number" value={todayValues.user2.toString()} onChange={(e) => handleInputChange('user2', e.target.value)} className="bg-transparent text-6xl font-black text-gray-800 w-32 text-center outline-none focus:scale-110 transition-transform" />
                <span className="absolute top-0 -right-4 text-xl" style={{ color: config.color2 }}>%</span>
            </div>
        </div>
      </div>

      <div className="bg-[#fdfbf7] p-6 rounded-3xl border border-gray-200 shadow-xl">
        <h3 className="text-gray-700 font-bold mb-6 text-lg pl-2 border-l-4 uppercase" style={{ borderColor: config.color1 }}>PROGRESO SEMANAL</h3>
        <div className="h-[300px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUser1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color1} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={config.color1} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUser2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color2} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={config.color2} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#4b5563', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#9ca3af" tick={{fill: '#4b5563', fontSize: 12}} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', color: '#1f2937', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} itemStyle={{ color: '#1f2937' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#374151' }} />
              <Area name={config.user1} type="monotone" dataKey="val1" stroke={config.color1} strokeWidth={3} fillOpacity={1} fill="url(#colorUser1)" animationDuration={1000} />
              <Area name={config.user2} type="monotone" dataKey="val2" stroke={config.color2} strokeWidth={3} fillOpacity={1} fill="url(#colorUser2)" animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}