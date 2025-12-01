'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { dia: 'L', yo: 70, ella: 80 }, { dia: 'M', yo: 85, ella: 75 },
  { dia: 'X', yo: 60, ella: 90 }, { dia: 'J', yo: 90, ella: 85 },
  { dia: 'V', yo: 75, ella: 95 }, { dia: 'S', yo: 100, ella: 100 },
  { dia: 'D', yo: 80, ella: 90 },
];

export default function HabitosPage() {
  return (
    <div className="space-y-8 py-6">
      <h1 className="text-3xl font-bold text-white text-center">✅ Hábitos</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-500/30 text-center">
            <p className="text-blue-300 text-sm">YO</p>
            <input type="number" defaultValue={75} className="bg-transparent text-3xl font-bold text-white w-full text-center outline-none" />
            <span className="text-sm text-gray-400">% Hoy</span>
        </div>
        <div className="bg-pink-900/30 p-4 rounded-xl border border-pink-500/30 text-center">
            <p className="text-pink-300 text-sm">ELLA</p>
            <input type="number" defaultValue={90} className="bg-transparent text-3xl font-bold text-white w-full text-center outline-none" />
            <span className="text-sm text-gray-400">% Hoy</span>
        </div>
      </div>

      <div className="h-80 bg-white/5 p-4 rounded-2xl border border-white/10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="dia" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{backgroundColor: '#111'}} />
            <Line type="monotone" dataKey="yo" stroke="#3b82f6" strokeWidth={3} />
            <Line type="monotone" dataKey="ella" stroke="#ec4899" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}