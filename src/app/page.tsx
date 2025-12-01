'use client';

import React, { useEffect, useState } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from '../firebase/config';

// --- Tipos ---
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Note {
  id: string;
  text: string;
  color: string;
  rotation: number;
}

// --- Componente Tablón de Corcho (Corkboard) ---
const CorkboardWidget = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Colores tipo Post-it pastel
  const noteColors = ['bg-yellow-200', 'bg-blue-200', 'bg-green-200', 'bg-pink-200', 'bg-orange-200'];

  // Cargar notas de Firebase
  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'notes'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]: any) => ({
          id,
          ...val
        }));
        setNotes(list);
      } else {
        setNotes([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Añadir nueva nota
  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
    const randomRotation = Math.floor(Math.random() * 10) - 5; // Rotación sutil entre -5 y 5 grados

    push(ref(db, 'notes'), {
      text: newNoteText,
      color: randomColor,
      rotation: randomRotation,
      createdAt: Date.now()
    });
    setNewNoteText('');
    setShowInput(false);
  };

  // Borrar nota
  const deleteNote = (id: string) => {
    remove(ref(db, `notes/${id}`));
  };

  return (
    <div className="relative w-full min-h-[400px] bg-[#d7c49e] rounded-xl border-[12px] border-[#8b5a2b] shadow-2xl p-6 overflow-hidden">
      
      {/* Título y Botón */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="bg-[#fdfbf7] px-4 py-2 shadow-md transform -rotate-1">
            <h2 className="text-xl font-black text-[#5d3a1a] uppercase tracking-widest border-b-2 border-[#5d3a1a]">
            Tablón de Anuncios 📌
            </h2>
        </div>
        <button 
          onClick={() => setShowInput(!showInput)}
          className="bg-white text-[#8b5a2b] px-4 py-2 rounded-full font-bold shadow-md hover:scale-105 transition hover:bg-gray-50 border-2 border-[#8b5a2b]"
        >
          {showInput ? 'Cerrar' : '+ Nueva Nota'}
        </button>
      </div>

      {/* Formulario Flotante para Añadir Nota */}
      {showInput && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 w-72 animate-in fade-in zoom-in duration-200">
          <form onSubmit={addNote} className="bg-yellow-100 p-4 shadow-[0_10px_20px_rgba(0,0,0,0.3)] rotate-1 border-t-8 border-yellow-200/50">
            <div className="w-4 h-4 rounded-full bg-red-600 mx-auto mb-3 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]"></div>
            <textarea
              autoFocus
              className="w-full bg-transparent outline-none text-gray-800 text-lg resize-none placeholder-gray-500/50 font-medium h-32"
              placeholder="Escribe algo importante..."
              value={newNoteText}
              onChange={e => setNewNoteText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addNote(e);
                }
              }}
            />
            <button type="submit" className="w-full mt-2 bg-[#8b5a2b] text-white text-sm font-bold py-2 rounded shadow hover:bg-[#6d4621] transition">
              Pinchar Nota 📌
            </button>
          </form>
        </div>
      )}

      {/* Grid de Notas (Post-its) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {notes.map((note) => (
          <div 
            key={note.id}
            className={`relative p-5 shadow-[3px_3px_10px_rgba(0,0,0,0.15)] transition-transform hover:scale-105 duration-300 group ${note.color} min-h-[160px] flex items-center justify-center text-center`}
            style={{ transform: `rotate(${note.rotation}deg)` }}
          >
            {/* Chincheta visual */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full shadow-[2px_2px_4px_rgba(0,0,0,0.3)] z-10 border border-red-800"></div>
            
            <p className="text-gray-800 font-medium text-lg leading-snug break-words w-full">
              {note.text}
            </p>

            {/* Botón borrar (visible al pasar el ratón) */}
            <button 
              onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
              className="absolute -bottom-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs font-bold shadow-lg hover:bg-red-600 hover:scale-110 cursor-pointer"
              title="Quitar nota"
            >
              ✕
            </button>
          </div>
        ))}
        
        {notes.length === 0 && !showInput && (
          <div className="col-span-full flex flex-col items-center justify-center text-[#8b5a2b]/30 mt-10 pointer-events-none select-none">
            <p className="text-6xl mb-2">📌</p>
            <p className="font-bold uppercase tracking-widest text-xl">El tablón está vacío</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Componente Lista de Tareas (Reutilizable) ---
const TodoCard = ({ title, dbPath, colorGradient }: { title: string, dbPath: string, colorGradient: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const unsubscribe = onValue(ref(db, dbPath), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...value,
        }));
        setTasks(taskList);
      } else {
        setTasks([]);
      }
    });
    return () => unsubscribe();
  }, [dbPath]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    push(ref(db, dbPath), { text: newTask, completed: false });
    setNewTask('');
  };

  const toggleTask = (task: Task) => {
    update(ref(db, `${dbPath}/${task.id}`), { completed: !task.completed });
  };

  const deleteTask = (id: string) => {
    remove(ref(db, `${dbPath}/${id}`));
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorGradient} text-white shadow-lg flex flex-col h-[400px]`}>
      <h3 className="text-2xl font-bold mb-4">Tareas de {title}</h3>
      
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
          className="w-full bg-white/20 placeholder-white/60 text-white rounded-lg px-3 py-2 outline-none focus:bg-white/30 transition text-sm"
        />
        <button type="submit" className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition">➕</button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {tasks.length === 0 && <p className="text-white/50 text-sm text-center mt-10">No hay tareas pendientes</p>}
        {tasks.map((task) => (
          <div key={task.id} className="group flex items-center justify-between bg-black/20 p-2 rounded-lg hover:bg-black/30 transition">
            <div onClick={() => toggleTask(task)} className="flex items-center gap-3 cursor-pointer flex-1">
              <div className={`w-5 h-5 rounded border border-white/50 flex items-center justify-center ${task.completed ? 'bg-white text-blue-600' : 'bg-transparent'}`}>
                {task.completed && <span className="text-xs font-bold">✓</span>}
              </div>
              <span className={`text-sm ${task.completed ? 'line-through text-white/50' : 'text-white'}`}>{task.text}</span>
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-white/40 hover:text-red-300 opacity-0 group-hover:opacity-100 transition px-2">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AgendaPage() {
  const [names, setNames] = useState({ user1: 'Usuario 1', user2: 'Usuario 2' });

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
      {/* TABLÓN DE ANUNCIOS (CORKBOARD) */}
      <CorkboardWidget />

      {/* LISTAS DE TAREAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodoCard title={names.user1} dbPath="tasks/user1" colorGradient="from-blue-600 to-blue-800" />
        <TodoCard title={names.user2} dbPath="tasks/user2" colorGradient="from-purple-600 to-purple-800" />
      </div>
    </div>
  );
}