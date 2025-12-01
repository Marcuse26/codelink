'use client';
import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../../firebase/config';

// --- Helpers de Fecha ---
const getTodayStr = () => new Date().toISOString().split('T')[0];

const getYesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export default function DeportePage() {
  const [streakData, setStreakData] = useState({ count: 0, lastDate: '' });
  const [loading, setLoading] = useState(true);

  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  // Cargar racha de Firebase
  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'streak'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStreakData(data);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Calcular racha visual
  const currentStreak = () => {
    if (!streakData.lastDate) return 0;
    if (streakData.lastDate === today) return streakData.count;
    if (streakData.lastDate === yesterday) return streakData.count;
    return 0; // Si se rompió la racha hace más de un día, mostramos 0
  };

  const isCompletedToday = streakData.lastDate === today;

  // Manejar click
  const handleStreak = () => {
    // CAMBIO AQUI: Valor inicial por defecto es 0 si se reinicia
    let newCount = 0; 

    // Solo sumamos si la última vez fue AYER (continuidad)
    if (streakData.lastDate === yesterday) {
      newCount = streakData.count + 1;
    } 
    // Si ya es hoy, no hacemos nada (protección extra)
    else if (streakData.lastDate === today) {
      return; 
    }
    // Si la fecha es vieja (racha rota), newCount se mantiene en 0 (Reset pedido)

    set(ref(db, 'streak'), {
      count: newCount,
      lastDate: today
    });
  };

  return (
    <div className="space-y-8 py-6 text-center max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">🏃 Strava & Racha</h1>
      
      {/* Tarjeta Contador */}
      <div className={`p-8 rounded-3xl border shadow-xl transition-all duration-500 ${isCompletedToday ? 'bg-gradient-to-br from-orange-400 to-orange-600 border-orange-400' : 'bg-white border-orange-200'}`}>
        <p className={`uppercase text-sm font-bold tracking-widest ${isCompletedToday ? 'text-orange-100' : 'text-orange-500'}`}>
          Racha Conjunta
        </p>
        <div className={`text-8xl font-black my-4 ${isCompletedToday ? 'text-white' : 'text-gray-800'}`}>
          {currentStreak()}
        </div>
        <p className={`text-sm font-medium ${isCompletedToday ? 'text-orange-100' : 'text-gray-400'}`}>
          Días seguidos entrenando
        </p>
      </div>

      {/* Botón de Acción */}
      <div className="relative group">
        <button 
            onClick={handleStreak}
            disabled={isCompletedToday || loading}
            className={`
                w-full py-6 rounded-2xl font-black text-xl shadow-lg transition-all transform active:scale-95
                ${isCompletedToday 
                    ? 'bg-green-500 text-white cursor-default shadow-green-500/30' 
                    : 'bg-[#1a1a2e] text-white hover:bg-black hover:shadow-2xl shadow-black/20 hover:-translate-y-1'
                }
            `}
        >
            {loading ? 'Cargando...' : isCompletedToday ? '✅ ¡Objetivo Cumplido!' : '🔥 ¡Hemos Entrenado!'}
        </button>
        
        {/* Efecto decorativo si no está completado */}
        {!isCompletedToday && (
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 -z-10"></div>
        )}
      </div>

      {/* Mensaje motivacional */}
      {!isCompletedToday && currentStreak() > 0 && (
          <p className="text-sm text-gray-500 animate-pulse">
              ¡No rompáis la racha! Haced algo de deporte hoy 💪
          </p>
      )}
      {!isCompletedToday && currentStreak() === 0 && (
          <p className="text-sm text-gray-500">
              ¡Empezad hoy una nueva racha legendaria! 🚀
          </p>
      )}
    </div>
  );
}