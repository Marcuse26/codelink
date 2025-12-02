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

// --- Componente Tablón de Corcho ---
const CorkboardWidget = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const noteColors = ['bg-yellow-200', 'bg-blue-200', 'bg-green-200', 'bg-pink-200', 'bg-orange-200'];

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'notes'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
        setNotes(list);
      } else {
        setNotes([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
    const randomRotation = Math.floor(Math.random() * 6) - 3; // Rotación sutil
    push(ref(db, 'notes'), { text: newNoteText, color: randomColor, rotation: randomRotation, createdAt: Date.now() });
    setNewNoteText('');
    setShowInput(false);
  };

  const deleteNote = (id: string) => remove(ref(db, `notes/${id}`));

  // ESTILOS FIJOS:
  // grid-cols-3 en móvil y grid-cols-6 o 8 en PC para que los posit sean SIEMPRE pequeños.
  const styles = { 
    grid: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8", 
    card: "p-3", // Más padding interno
    text: "text-xs md:text-sm font-bold" // Texto más grande y negrita
  };

  return (
    <div className="relative w-full max-w-full mx-auto min-h-[400px] bg-[#d7c49e] rounded-xl border-[8px] md:border-[12px] border-[#8b5a2b] shadow-2xl p-4 md:p-6 overflow-hidden flex flex-col box-border">
      <div className="flex justify-between items-center mb-6 relative z-10 shrink-0">
        <div className="bg-[#fdfbf7] px-3 py-1 md:px-4 md:py-2 shadow-md transform -rotate-1">
            <h2 className="text-lg md:text-xl font-black text-[#5d3a1a] uppercase tracking-widest border-b-2 border-[#5d3a1a]">TABLÓN ({notes.length + 1})</h2>
        </div>
        <button onClick={() => setShowInput(!showInput)} className="bg-white text-[#8b5a2b] px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-sm md:text-base shadow-md hover:scale-105 transition hover:bg-gray-50 border-2 border-[#8b5a2b]">{showInput ? 'CERRAR' : '+ NOTA'}</button>
      </div>
      
      {showInput && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 w-64 md:w-72 animate-in fade-in zoom-in duration-200">
          <form onSubmit={addNote} className="bg-yellow-100 p-4 shadow-[0_10px_20px_rgba(0,0,0,0.3)] rotate-1 border-t-8 border-yellow-200/50">
            <div className="w-4 h-4 rounded-full bg-red-600 mx-auto mb-3 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]"></div>
            <textarea autoFocus className="w-full bg-transparent outline-none text-gray-800 text-lg resize-none placeholder-gray-500/50 font-medium h-32" placeholder="Escribe algo..." value={newNoteText} onChange={e => setNewNoteText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(e); } }} />
            <button type="submit" className="w-full mt-2 bg-[#8b5a2b] text-white text-sm font-bold py-2 rounded shadow hover:bg-[#6d4621] transition">FIJAR NOTA</button>
          </form>
        </div>
      )}

      {/* Grid con items alineados al inicio */}
      <div className={`grid ${styles.grid} auto-rows-min gap-3 md:gap-5 transition-all duration-500 ease-in-out w-full content-start`}>
        
        {/* --- NOTA FIJA WEBEA --- */}
        <div className={`relative shadow-md hover:shadow-xl transition-transform hover:scale-105 duration-300 group bg-white aspect-square ${styles.card} flex flex-col items-center justify-between text-center overflow-hidden w-full`} style={{ transform: 'rotate(-1deg)' }}>
            {/* Chincheta */}
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full shadow-sm z-10 border border-red-800"></div>
            
            {/* Contenido Nota Fija */}
            <div className="flex flex-col items-center justify-center w-full h-full gap-1 pt-2">
                {/* Imagen ajustada para no recortarse (object-contain) y altura controlada */}
                <div className="w-full h-1/2 flex items-center justify-center">
                    <img src="/webea.png" alt="Webea" className="w-full h-full object-contain" />
                </div>
                
                {/* Texto más grande y legible */}
                <div className="w-full flex flex-col justify-center h-1/2">
                    <p className="text-[10px] md:text-xs font-black text-gray-800 leading-tight uppercase">
                        Desarrollado por Webea
                    </p>
                    <div className="mt-1 pt-1 border-t border-gray-100 w-full">
                        <p className="text-[8px] md:text-[9px] font-bold text-gray-500 leading-none mb-0.5">
                            Soporte:
                        </p>
                        <p className="text-[8px] md:text-[9px] font-bold text-blue-600 break-all leading-tight">
                            webea.oficial@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- NOTAS DINÁMICAS --- */}
        {notes.map((note) => (
          <div key={note.id} className={`relative shadow-md hover:shadow-xl transition-transform hover:scale-105 duration-300 group ${note.color} aspect-square ${styles.card} flex items-center justify-center text-center overflow-hidden w-full`} style={{ transform: `rotate(${note.rotation}deg)` }}>
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full shadow-sm z-10 border border-red-800"></div>
            
            {/* Texto de nota normal más grande */}
            <p className={`text-gray-800 leading-snug break-words w-full h-full flex items-center justify-center ${styles.text}`}>
                {note.text}
            </p>
            
            <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="absolute -bottom-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs font-bold shadow-lg hover:bg-red-600 cursor-pointer z-20" title="Quitar">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Componente Lista de Tareas (SIN CAMBIOS) ---
const TodoCard = ({ title, dbPath, userColor }: { title: string, dbPath: string, userColor: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const unsubscribe = onValue(ref(db, dbPath), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.entries(data).map(([id, value]: any) => ({ id, ...value }));
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

  const toggleTask = (task: Task) => update(ref(db, `${dbPath}/${task.id}`), { completed: !task.completed });
  const deleteTask = (id: string) => remove(ref(db, `${dbPath}/${id}`));

  return (
    <div 
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col h-[400px] border border-white/5 w-full max-w-full overflow-hidden"
        style={{ 
            background: `linear-gradient(145deg, ${userColor}, #0f0f1a)`,
            boxShadow: `0 10px 30px -10px ${userColor}60`
        }}
    >
      <h3 className="text-2xl font-bold mb-4 border-b border-white/20 pb-2 uppercase truncate">TAREAS DE {title}</h3>
      
      <form onSubmit={addTask} className="flex gap-2 mb-4 w-full">
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Nueva tarea..." className="w-full bg-black/20 placeholder-white/50 text-white rounded-lg px-3 py-2 outline-none focus:bg-black/40 transition text-sm backdrop-blur-sm" />
        <button type="submit" className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition shrink-0">➕</button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar w-full">
        {tasks.map((task) => (
          <div key={task.id} className="group flex items-center justify-between bg-black/20 p-2 rounded-lg hover:bg-black/30 transition backdrop-blur-md border border-white/5 w-full">
            <div onClick={() => toggleTask(task)} className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
              <div className={`w-5 h-5 shrink-0 rounded border border-white/50 flex items-center justify-center transition-colors ${task.completed ? 'bg-white text-black' : 'bg-transparent'}`}>
                {task.completed && <span className="text-xs font-bold">✓</span>}
              </div>
              <span className={`text-sm ${task.completed ? 'line-through text-white/50' : 'text-white'} truncate`}>{task.text}</span>
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-white/40 hover:text-red-300 opacity-0 group-hover:opacity-100 transition px-2 shrink-0">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AgendaPage() {
  const [config, setConfig] = useState({ 
    user1: 'Usuario 1', 
    user2: 'Usuario 2', 
    color1: '#3b82f6', 
    color2: '#ec4899' 
  });

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'settings'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            setConfig({
                user1: data.user1 || 'Usuario 1',
                user2: data.user2 || 'Usuario 2',
                color1: data.color1 || '#3b82f6',
                color2: data.color2 || '#ec4899'
            });
        }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      <CorkboardWidget />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <TodoCard title={config.user1} dbPath="tasks/user1" userColor={config.color1} />
        <TodoCard title={config.user2} dbPath="tasks/user2" userColor={config.color2} />
      </div>
    </div>
  );
}