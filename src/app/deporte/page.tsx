'use client';
import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../../firebase/config';

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getYesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export default function DeportePage() {
  const [streakData, setStreakData] = useState({ count: 0, lastDate: '' });
  const [config, setConfig] = useState({ 
    user1: 'Usuario 1', 
    user2: 'Usuario 2',
    sportUrl1: '#',
    sportUrl2: '#'
  });
  const [loading, setLoading] = useState(true);
  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  useEffect(() => {
    const unsubStreak = onValue(ref(db, 'streak'), (snapshot) => {
      const data = snapshot.val();
      if (data) setStreakData(data);
      setLoading(false);
    });
    const unsubConfig = onValue(ref(db, 'settings'), (snapshot) => {
        const data = snapshot.val();
        if (data) setConfig(data);
    });
    return () => { unsubStreak(); unsubConfig(); };
  }, []);

  const currentStreak = () => {
    if (!streakData.lastDate) return 0;
    if (streakData.lastDate === today) return streakData.count;
    if (streakData.lastDate === yesterday) return streakData.count;
    return 0; 
  };

  const isCompletedToday = streakData.lastDate === today;

  const handleStreak = () => {
    let newCount = 1; 
    if (streakData.lastDate === yesterday) {
      newCount = streakData.count + 1;
    } else if (streakData.lastDate === today) {
      return; 
    }
    set(ref(db, 'streak'), { count: newCount, lastDate: today });
  };

  const handleUndo = () => {
    if (!isCompletedToday) return;
    const newCount = Math.max(0, streakData.count - 1);
    set(ref(db, 'streak'), { count: newCount, lastDate: yesterday });
  };

  return (
    <div className="space-y-8 py-6 text-center max-w-md mx-auto">
      
      <div className={`p-8 rounded-3xl border shadow-xl transition-all duration-500 ${isCompletedToday ? 'bg-gradient-to-br from-orange-400 to-orange-600 border-orange-400' : 'bg-white border-orange-200'}`}>
        <p className={`uppercase text-sm font-bold tracking-widest ${isCompletedToday ? 'text-orange-100' : 'text-orange-500'}`}>
          RACHA CONJUNTA
        </p>
        <div className={`text-8xl font-black my-4 ${isCompletedToday ? 'text-white' : 'text-gray-800'}`}>
          {currentStreak()}
        </div>
        <p className={`text-sm font-medium uppercase ${isCompletedToday ? 'text-orange-100' : 'text-gray-400'}`}>
          DÍAS SEGUIDOS ENTRENANDO
        </p>
      </div>

      <div className="relative group space-y-4">
        <button onClick={handleStreak} disabled={isCompletedToday || loading} className={`w-full py-6 rounded-2xl font-black text-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 uppercase ${isCompletedToday ? 'bg-green-500 text-white cursor-default shadow-green-500/30' : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-2xl shadow-orange-500/20 hover:-translate-y-1'}`}>
            {loading ? 'CARGANDO...' : isCompletedToday ? '✅ ¡OBJETIVO CUMPLIDO!' : '🔥 ¡HEMOS ENTRENADO!'}
        </button>
        
        {isCompletedToday && (
            <button onClick={handleUndo} className="text-red-500 text-sm font-bold hover:text-red-700 hover:underline transition-all uppercase">
                ❌ ME HE EQUIVOCADO, DESHACER
            </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <a href={config.sportUrl1 || '#'} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md border border-orange-100 hover:shadow-lg hover:border-orange-300 hover:-translate-y-1 transition-all group">
            <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🏃‍♂️</span>
            <span className="font-bold text-gray-700 text-xs md:text-sm uppercase">DEPORTE DE {config.user1}</span>
        </a>
        <a href={config.sportUrl2 || '#'} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md border border-orange-100 hover:shadow-lg hover:border-orange-300 hover:-translate-y-1 transition-all group">
            <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🏃‍♀️</span>
            <span className="font-bold text-gray-700 text-xs md:text-sm uppercase">DEPORTE DE {config.user2}</span>
        </a>
      </div>
    </div>
  );
}