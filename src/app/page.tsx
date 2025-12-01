'use client';

import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';

// Datos fijos del Heatmap (puntos)
const heatmapData = [
  { dia: 'L', yo: 0.9, ella: 0.8 }, { dia: 'M', yo: 0.5, ella: 1.0 },
  { dia: 'X', yo: 1.0, ella: 0.7 }, { dia: 'J', yo: 0.3, ella: 0.9 },
  { dia: 'V', yo: 0.8, ella: 0.5 }, { dia: 'S', yo: 0.6, ella: 0.4 },
  { dia: 'D', yo: 0.2, ella: 0.1 },
];

const getColor = (v: number) => {
    // Usamos colores brillantes que contrasten con el fondo oscuro de la tarjeta
    if (v >= 0.9) return 'bg-[#4ade80] shadow-[0_0_10px_#4ade80]'; // Verde neón
    if (v >= 0.7) return 'bg-[#86efac]'; 
    if (v >= 0.4) return 'bg-[#166534]'; 
    return 'bg-white/10'; // Gris translúcido para inactivo
};

export default function AgendaPage() {
  const [names, setNames] = useState({ user1: 'Usuario 1', user2: 'Usuario 2' });

  // Obtener nombres reales de la configuración
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

  return (
    <div className="space-y-8">
      
      {/* HEATMAP LIMPIO */}
      <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[250px]">
        <h2 className="text-xl font-bold text-white mb-8 self-start px-4">Mapa de Actividad</h2>
        
        {/* Contenedor de puntos */}
        <div className="flex gap-6">
            {heatmapData.map((d, i) => (
                <div key={i} className="flex flex-col gap-4">
                    {/* Punto Arriba (Ella/Él) */}
                    <div 
                        className={`w-12 h-12 rounded-xl transition-all duration-500 ${getColor(d.ella)}`} 
                        title={`Nivel: ${Math.round(d.ella * 100)}%`}
                    ></div>
                    
                    {/* Punto Abajo (Tú) */}
                    <div 
                        className={`w-12 h-12 rounded-xl transition-all duration-500 ${getColor(d.yo)}`} 
                        title={`Nivel: ${Math.round(d.yo * 100)}%`}
                    ></div>
                </div>
            ))}
        </div>
      </div>

      {/* TARJETAS DE TAREAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a 
            href="https://trello.com" 
            target="_blank" 
            className="group block p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg hover:scale-[1.02] transition-transform"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/10 rounded-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-2xl">↗</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">Tareas de {names.user1}</h3>
            <p className="text-blue-200 text-sm">Ver planificación académica</p>
        </a>

        <a 
            href="https://notion.so" 
            target="_blank" 
            className="group block p-8 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 text-white shadow-lg hover:scale-[1.02] transition-transform"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/10 rounded-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-2xl">↗</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">Tareas de {names.user2}</h3>
            <p className="text-purple-200 text-sm">Ver planificación académica</p>
        </a>
      </div>
    </div>
  );
}