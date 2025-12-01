'use client';
import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../../firebase/config';

export default function ConfigPage() {
  const [form, setForm] = useState({ 
    user1: '', 
    user2: '', 
    color1: '#3b82f6', 
    color2: '#ec4899', 
    calendarUrl1: '', // Nueva URL 1
    calendarUrl2: '', // Nueva URL 2
    reunionDate: '' 
  });

  useEffect(() => {
    onValue(ref(db, 'settings'), (s) => {
        const data = s.val();
        if (data) setForm({ ...form, ...data });
    });
  }, []);

  const save = () => {
    set(ref(db, 'settings'), form);
    alert('¡Ajustes guardados correctamente!');
  };

  return (
    <div className="p-6 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black text-white text-center mb-8">Ajustes Generales</h1>
      
      {/* Sección Usuario 1 */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <label className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2 block">Usuario 1</label>
        <div className="flex gap-4 mb-3">
            <input 
                className="flex-1 p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition"
                placeholder="Nombre"
                value={form.user1}
                onChange={e => setForm({...form, user1: e.target.value})}
            />
            <input 
                type="color"
                className="w-14 h-12 rounded-xl bg-transparent cursor-pointer border-0 p-0"
                value={form.color1}
                onChange={e => setForm({...form, color1: e.target.value})}
            />
        </div>
        <input 
            className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition text-sm"
            placeholder="URL del Calendario (ej: https://calendar.google.com/...)"
            value={form.calendarUrl1}
            onChange={e => setForm({...form, calendarUrl1: e.target.value})}
        />
      </div>

      {/* Sección Usuario 2 */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <label className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2 block">Usuario 2</label>
        <div className="flex gap-4 mb-3">
            <input 
                className="flex-1 p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition"
                placeholder="Nombre"
                value={form.user2}
                onChange={e => setForm({...form, user2: e.target.value})}
            />
            <input 
                type="color"
                className="w-14 h-12 rounded-xl bg-transparent cursor-pointer border-0 p-0"
                value={form.color2}
                onChange={e => setForm({...form, color2: e.target.value})}
            />
        </div>
        <input 
            className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition text-sm"
            placeholder="URL del Calendario"
            value={form.calendarUrl2}
            onChange={e => setForm({...form, calendarUrl2: e.target.value})}
        />
      </div>

      {/* Fecha Reunion */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <label className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2 block">Fecha del Reencuentro 💖</label>
        <input 
            type="datetime-local"
            className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition"
            value={form.reunionDate}
            onChange={e => setForm({...form, reunionDate: e.target.value})}
        />
      </div>

      <button 
        onClick={save} 
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform"
      >
        Guardar Cambios
      </button>
    </div>
  );
}