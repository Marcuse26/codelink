'use client';

import React from 'react';

// Simulación de Heatmap (en una versión real vendría de Firebase)
const heatmapData = [
  { dia: 'L', yo: 0.9, ella: 0.8 },
  { dia: 'M', yo: 0.5, ella: 1.0 },
  { dia: 'X', yo: 1.0, ella: 0.7 },
  { dia: 'J', yo: 0.3, ella: 0.9 },
  { dia: 'V', yo: 0.8, ella: 0.5 },
  { dia: 'S', yo: 0.6, ella: 0.4 },
  { dia: 'D', yo: 0.2, ella: 0.1 },
];

const getColorIntensity = (value: number) => {
  if (value >= 0.9) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
  if (value >= 0.7) return 'bg-green-400';
  if (value >= 0.4) return 'bg-green-600/50';
  return 'bg-gray-700';
};

const LinkCard = ({ title, desc, link, color }: { title: string, desc: string, link: string, color: string }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" className={`block p-6 rounded-2xl border border-white/10 bg-gradient-to-br ${color} hover:scale-[1.02] transition-transform duration-300 shadow-xl group`}>
        <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
            {title}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
        </h2>
        <p className="text-white/80 text-sm font-medium">
            {desc}
        </p>
    </a>
);

export default function AcademicPage() {
  return (
    <div className="space-y-12 py-6">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          🎓 Centro de Ingeniería
        </h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest">Gestión Académica Conjunta</p>
      </header>

      {/* Heatmap Section */}
      <section className="glass-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
          Productividad Semanal
        </h2>
        
        <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4">
                {heatmapData.map((item) => (
                    <div key={item.dia} className="flex flex-col items-center gap-2">
                        <span className="text-xs text-gray-500 font-bold">{item.dia}</span>
                        {/* Puntos de Ella */}
                        <div 
                            className={`w-10 h-10 rounded-lg transition-all duration-500 ${getColorIntensity(item.ella)}`} 
                            title={`Ella: ${Math.round(item.ella * 100)}%`}
                        ></div>
                        {/* Puntos Míos */}
                        <div 
                            className={`w-10 h-10 rounded-lg transition-all duration-500 ${getColorIntensity(item.yo)}`} 
                            title={`Yo: ${Math.round(item.yo * 100)}%`}
                        ></div>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400 bg-black/20 px-4 py-2 rounded-full">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Élite</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400"></span> Bien</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-700"></span> Relax</div>
            </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="grid md:grid-cols-2 gap-6">
        <LinkCard 
            title="Mi Espacio Académico" 
            desc="Acceso a Trello/Notion: Tareas, Entregas y Exámenes."
            link="https://trello.com" 
            color="from-blue-600/80 to-blue-900/80"
        />
        <LinkCard 
            title="Su Espacio Académico" 
            desc="Ver en qué proyecto está trabajando ahora mismo."
            link="https://notion.so" 
            color="from-purple-600/80 to-purple-900/80"
        />
      </section>
    </div>
  );
}