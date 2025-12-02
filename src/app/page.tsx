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

// --- Helper para generar chinchetas estables basadas en el ID ---
// Esto evita que la chincheta "baile" o cambie de color al renderizar
const getPinStyle = (id: string) => {
  const pinColors = [
    'bg-red-600 border-red-800', 
    'bg-blue-600 border-blue-800', 
    'bg-green-600 border-green-800', 
    'bg-purple-600 border-purple-800', 
    'bg-gray-800 border-black'
  ];
  
  // Usamos el ID para generar un número pseudo-aleatorio consistente
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const colorClass = pinColors[hash % pinColors.length];
  // Posición aleatoria entre 10% y 80% para que no se salga por los bordes
  const leftPos = (hash % 70) + 10; 

  return { colorClass, leftPos };
};

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
    const randomRotation = Math.floor(Math.random() * 6) - 3; 
    push(ref(db, 'notes'), { text: newNoteText, color: randomColor, rotation: randomRotation, createdAt: Date.now() });
    setNewNoteText('');
    setShowInput(false);
  };

  const deleteNote = (id: string) => remove(ref(db, `notes/${id}`));

  const styles = { 
    grid: "grid-cols-4 gap-2 md:gap-3", 
    card: "p-2", 
    text: "text-base md:text-xl font-black leading-tight" 
  };

  return (
    <div className="relative w-full max-w-full mx-auto min-h-[250px] md:min-h-[350px] bg-[#d7c49e] rounded-xl border-[8px] md:border-[12px] border-[#8b5a2b] shadow-2xl p-4 overflow-hidden flex flex-col box-border shrink-0">
      <div className="flex justify-between items-center mb-4 relative z-10 shrink-0">
        <div className="bg-[#fdfbf7] px-3 py-1 shadow-md transform -rotate-1">
            <h2 className="text-lg font-black text-[#5d3a1a] uppercase tracking-widest border-b-2 border-[#5d3a1a]">TABLÓN ({notes.length + 1})</h2>
        </div>
        <button onClick={() => setShowInput(!showInput)} className="bg-white text-[#8b5a2b] px-3 py-1 rounded-full font-bold text-xs shadow-md hover:scale-105 transition hover:bg-gray-50 border-2 border-[#8b5a2b]">{showInput ? 'CERRAR' : '+ NOTA'}</button>
      </div>
      
      {showInput && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 w-60 animate-in fade-in zoom-in duration-200">
          <form onSubmit={addNote} className="bg-yellow-100 p-4 shadow-[0_10px_20px_rgba(0,0,0,0.3)] rotate-1 border-t-8 border-yellow-200/50">
            {/* Chincheta decorativa del formulario (la mantenemos solo aquí por estética del input) */}
            <div className="w-4 h-4 rounded-full bg-red-600 mx-auto mb-3 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] border border-red-800"></div>
            <textarea autoFocus className="w-full bg-transparent outline-none text-gray-900 text-lg font-bold resize-none placeholder-gray-500/50 h-24" placeholder="Escribe algo..." value={newNoteText} onChange={e => setNewNoteText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(e); } }} />
            <button type="submit" className="w-full mt-2 bg-[#8b5a2b] text-white text-xs font-bold py-2 rounded shadow hover:bg-[#6d4621] transition">FIJAR NOTA</button>
          </form>
        </div>
      )}

      <div className={`grid ${styles.grid} auto-rows-min transition-all duration-500 ease-in-out w-full content-start`}>
        
        {/* --- NOTA FIJA WEBEA (Sin chincheta ni punto) --- */}
        <div className={`relative shadow-md hover:shadow-xl transition-transform hover:scale-105 duration-300 group bg-white aspect-square ${styles.card} flex flex-col items-center justify-between text-center overflow-hidden w-full border border-gray-300 shadow-inner`} style={{ transform: 'rotate(-1deg)' }}>
            {/* SE HA ELIMINADO EL DIV DEL PUNTO ROJO AQUÍ */}
            
            <div className="flex flex-col items-center justify-center w-full h-full gap-1 pt-1">
                <div className="w-full h-1/2 flex items-center justify-center p-1">
                    <img src="/webea.png" alt="Webea" className="w-full h-full object-contain" />
                </div>
                <div className="w-full flex flex-col justify-center h-1/2 border-t border-gray-100 pt-1">
                    <p className="text-[10px] font-black text-gray-800 leading-tight uppercase mb-0.5">
                        Dev by Webea
                    </p>
                    <div className="w-full">
                        <p className="text-[9px] font-bold text-blue-600 break-all leading-tight">
                            webea.oficial
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- NOTAS DINÁMICAS (Con chincheta aleatoria) --- */}
        {notes.map((note) => {
          const { colorClass, leftPos } = getPinStyle(note.id); // Generar estilo de chincheta
          
          return (
            <div key={note.id} className={`relative shadow-md hover:shadow-xl transition-transform hover:scale-105 duration-300 group ${note.color} aspect-square ${styles.card} flex items-center justify-center text-center overflow-hidden w-full border border-white/40 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]`} style={{ transform: `rotate(${note.rotation}deg)` }}>
              
              {/* --- CHINCHETA ALEATORIA --- */}
              {/* Se ha sustituido el punto rojo central por esto: */}
              <div 
                className={`absolute -top-2 w-3 h-3 md:w-4 md:h-4 rounded-full shadow-[2px_2px_5px_rgba(0,0,0,0.3)] z-20 border ${colorClass}`} 
                style={{ left: `${leftPos}%` }}
              >
                {/* Brillo de la chincheta */}
                <div className="absolute top-1 left-1 w-1 h-1 bg-white/50 rounded-full"></div>
              </div>
              
              {/* Texto de las notas */}
              <p className={`text-gray-900 break-words w-full h-full flex items-center justify-center overflow-y-auto custom-scrollbar ${styles.text}`}>
                  {note.text}
              </p>
              
              <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="absolute -bottom-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold shadow-lg hover:bg-red-600 cursor-pointer z-20">✕</button>
            </div>
          );
        })}
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
        className="p-4 rounded-2xl text-white shadow-lg flex flex-col h-full border border-white/5 w-full overflow-hidden"
        style={{ 
            background: `linear-gradient(145deg, ${userColor}, #0f0f1a)`,
            boxShadow: `0 10px 30px -10px ${userColor}60`
        }}
    >
      <h3 className="text-lg md:text-xl font-bold mb-3 border-b border-white/20 pb-2 uppercase truncate">TAREAS DE {title}</h3>
      
      <form onSubmit={addTask} className="flex gap-2 mb-3 w-full shrink-0">
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Nueva tarea..." className="w-full bg-black/20 placeholder-white/50 text-white rounded-lg px-3 py-2 outline-none focus:bg-black/40 transition text-sm backdrop-blur-sm" />
        <button type="submit" className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition shrink-0">➕</button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar w-full min-h-0">
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
    <div className="flex flex-col gap-4 w-full max-w-full h-[calc(100vh-130px)] md:h-[calc(100vh-100px)] pb-1">
      <CorkboardWidget />
      <div className="grid grid-cols-2 gap-4 w-full flex-1 min-h-0">
        <TodoCard title={config.user1} dbPath="tasks/user1" userColor={config.color1} />
        <TodoCard title={config.user2} dbPath="tasks/user2" userColor={config.color2} />
      </div>
    </div>
  );
}