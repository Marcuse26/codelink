'use client';
import React from 'react';

const heatmapData = [
  { dia: 'L', yo: 0.9, ella: 0.8 }, { dia: 'M', yo: 0.5, ella: 1.0 },
  { dia: 'X', yo: 1.0, ella: 0.7 }, { dia: 'J', yo: 0.3, ella: 0.9 },
  { dia: 'V', yo: 0.8, ella: 0.5 }, { dia: 'S', yo: 0.6, ella: 0.4 },
  { dia: 'D', yo: 0.2, ella: 0.1 },
];

const getColor = (v: number) => v >= 0.9 ? 'bg-green-500' : v >= 0.7 ? 'bg-green-400' : v >= 0.4 ? 'bg-yellow-500' : 'bg-gray-700';

export default function AcademicPage() {
  return (
    <div className="space-y-10 py-6 text-center">
      <h1 className="text-4xl font-bold text-white">🎓 Ingeniería</h1>
      
      <div className="glass-card p-6 rounded-3xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6">Heatmap Semanal</h2>
        <div className="flex justify-center gap-4">
            {heatmapData.map((d) => (
                <div key={d.dia} className="flex flex-col gap-2">
                    <span className="text-xs text-gray-400">{d.dia}</span>
                    <div className={`w-8 h-8 rounded ${getColor(d.ella)}`} title="Ella"></div>
                    <div className={`w-8 h-8 rounded ${getColor(d.yo)}`} title="Yo"></div>
                </div>
            ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">Arriba: Ella | Abajo: Tú</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a href="https://trello.com" target="_blank" className="p-6 bg-blue-900/50 rounded-xl text-white font-bold border border-blue-500/30">Mis Tareas ↗</a>
        <a href="https://notion.so" target="_blank" className="p-6 bg-purple-900/50 rounded-xl text-white font-bold border border-purple-500/30">Sus Tareas ↗</a>
      </div>
    </div>
  );
}