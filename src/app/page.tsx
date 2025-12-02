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
    const randomRotation = Math.floor(Math.random() * 10) - 5; 
    push(ref(db, 'notes'), { text: newNoteText, color: randomColor, rotation: randomRotation, createdAt: Date.now() });
    setNewNoteText('');
    setShowInput(false);
  };

  const deleteNote = (id: string) => remove(ref(db, `notes/${id}`));

  // Sumamos 1 al conteo para incluir la nota fija de Webea en el cálculo del grid
  const getDynamicStyles = (count: number) => {
    if (count <= 4) return { grid: "grid-cols-2 md:grid-cols-2", card: "min-h-[140px] md:min-h-[160px] p-3 md:p-5", text: "text-base md:text-lg" };
    else if (count <= 9) return { grid: "grid-cols-3 md:grid-cols-3", card: "min-h-[110px] md:min-h-[130px] p-2 md:p-4", text: "text-sm md:text-base" };
    else if (count <= 16) return { grid: "grid-cols-4 md:grid-cols-4", card: "min-h-[90px] md:min-h-[100px] p-1 md:p-2", text: "text-xs md:text-sm" };
    else return { grid: "grid-cols-5 md:grid-cols-6", card: "min-h-[70px] md:min-h-[80px] p-1", text: "text-[10px] md:text-xs" };
  };
  
  // +1 por la nota fija
  const styles = getDynamicStyles(notes.length + 1);

  return (
    <div className="relative w-full max-w-full mx-auto min-h-[400px] bg-[#d7c49e] rounded-xl border-[8px] md:border-[12px] border-[#8b5a2b] shadow-2xl p-4 md:p-6 overflow-hidden flex flex-col box-border">
      <div className="flex justify-between items-center mb-6 relative z-10 shrink-0">
        <div className="bg-[#fdfbf7] px-3 py-1 md:px-4 md:py-2 shadow-md transform -rotate-1">
            {/* Contamos la nota fija en el total */}
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

      <div className={`grid ${styles.grid} gap-2 md:gap-4 transition-all duration-500 ease-in-out w-full`}>
        
        {/* --- NOTA FIJA WEBEA --- */}
        <div className={`relative shadow-[2px_2px_8px_rgba(0,0,0,0.15)] transition-transform hover:scale-105 duration-300 group bg-white ${styles.card} flex flex-col items-center justify-center text-center overflow-hidden w-full`} style={{ transform: 'rotate(-2deg)' }}>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full shadow-[1px_1px_2px_rgba(0,0,0,0.3)] z-10 border border-red-800"></div>
            <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                {/* Logo Webea */}
                <img src="/webea.png" alt="Webea" className="w-auto h-8 md:h-10 object-contain mb-1" />
                <div className={`text-gray-800 font-bold leading-tight ${styles.text}`}>
                    <p>Desarrollado por Webea</p>
                    <div className="mt-2 pt-2 border-t border-gray-100 w-full">
                        <p className="text-[0.7em] font-normal text-gray-500">Contacto de soporte:</p>
                        <p className="text-[0.7em] text-blue-600 break-all">webea.oficial@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- NOTAS DINÁMICAS --- */}
        {notes.map((note) => (
          <div key={note.id} className={`relative shadow-[2px_2px_8px_rgba(0,0,0,0.15)] transition-transform hover:scale-105 duration-300 group ${note.color} ${styles.card} flex items-center justify-center text-center overflow-hidden w-full`} style={{ transform: `rotate(${note.rotation}deg)` }}>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full shadow-[1px_1px_2px_rgba(0,0,0,0.3)] z-10 border border-red-800"></div>
            <p className={`text-gray-800 font-medium leading-snug break-words w-full ${styles.text}`}>{note.text}</p>
            <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="absolute -bottom-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold shadow-lg hover:bg-red-600 hover:scale-110 cursor-pointer" title="Quitar">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Componente Lista de Tareas ---
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