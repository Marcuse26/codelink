'use client';
import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../../firebase/config';

export default function ConfigPage() {
  const [form, setForm] = useState({ user1: '', user2: '', reunionDate: '' });

  useEffect(() => {
    onValue(ref(db, 'settings'), (s) => s.val() && setForm(s.val()));
  }, []);

  const save = () => {
    set(ref(db, 'settings'), form);
    alert('Guardado!');
  };

  return (
    <div className="p-6 space-y-6 text-center">
      <h1 className="text-2xl font-bold text-white">Ajustes</h1>
      <input 
        className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
        placeholder="Nombre 1"
        value={form.user1}
        onChange={e => setForm({...form, user1: e.target.value})}
      />
      <input 
        className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
        placeholder="Nombre 2"
        value={form.user2}
        onChange={e => setForm({...form, user2: e.target.value})}
      />
      <input 
        type="datetime-local"
        className="w-full p-3 rounded bg-white/10 text-white border border-white/20"
        value={form.reunionDate}
        onChange={e => setForm({...form, reunionDate: e.target.value})}
      />
      <button onClick={save} className="w-full py-3 bg-pink-600 rounded text-white font-bold">Guardar</button>
    </div>
  );
}