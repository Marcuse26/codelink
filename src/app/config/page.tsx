'use client';

import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../../firebase/config';

export default function ConfigPage() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const settingsRef = ref(db, 'settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setName1(data.user1 || '');
        setName2(data.user2 || '');
        setDate(data.reunionDate || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      await set(ref(db, 'settings'), {
        user1: name1,
        user2: name2,
        reunionDate: date
      });
      setMsg('✅ Configuración actualizada correctamente.');
    } catch (error) {
      console.error(error);
      setMsg('❌ Error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pt-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">⚙️ Ajustes</h1>
        <p className="text-gray-400 text-sm">Personaliza vuestra experiencia</p>
      </div>

      <form onSubmit={handleSave} className="glass-card p-8 rounded-3xl space-y-6">
        <div className="space-y-4">
          <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider">Nuestros Nombres</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs mb-2 text-gray-500">Tú</p>
              <input 
                type="text" 
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="glass-input w-full p-3 text-center rounded-xl"
                placeholder="Nombre 1"
              />
            </div>
            <div>
              <p className="text-xs mb-2 text-gray-500">Ella/Él</p>
              <input 
                type="text" 
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="glass-input w-full p-3 text-center rounded-xl"
                placeholder="Nombre 2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
           <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider">Próximo Reencuentro</label>
           <input 
             type="datetime-local" 
             value={date}
             onChange={(e) => setDate(e.target.value)}
             className="glass-input w-full p-4 text-lg rounded-xl text-center text-white/90"
           />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-neon py-4 rounded-xl shadow-lg mt-4"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        {msg && (
          <div className="p-3 rounded-xl bg-white/10 text-center text-sm font-medium border border-white/10">
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}