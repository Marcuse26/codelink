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

  const getDynamicStyles = (count: number) => {
    if (count <= 4) return { grid: "grid-cols-2 md:grid-cols-2", card: "min-h-[160px] p-5", text: "text-lg" };
    else if (count <= 9) return { grid: "grid-cols-3 md:grid-cols-3", card: "min-h-[130px] p-4", text: "text-base" };
    else if (count <= 16) return { grid: "grid-cols-4 md:grid-cols-4", card: "min-h-[100px] p-2", text: "text-sm" };
    else return { grid: "grid-cols-5 md:grid-cols-6", card: "min-h-[80px] p-1", text: "text-xs" };
  };
  const styles = getDynamicStyles(notes.length);

  return (
    <div className="relative w-full min-h-[400px] bg-[#d7c49e] rounded-xl border-[12px] border-[#8b5a2b] shadow-2xl p-6 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6 relative z-10 shrink-0">
        <div className="bg-[#fdfbf7] px-4 py-2 shadow-md transform -rotate-1">
            {/* TÍTULO LIMPIO SIN EMOJIS */}
            <h2 className="text-xl font-black text-[#5d3a1a] uppercase tracking-widest border-b-2 border-[#5d3a1a]">TABLÓN ({notes.length})</h2>
        </div>
        <button onClick={() => setShowInput(!showInput)} className="bg-white text-[#8b5a2b] px-4 py-2 rounded-full font-bold shadow-md hover:scale-105 transition hover:bg-gray-50 border-2 border-[#8b5a2b]">{showInput ? 'CERRAR' : '+ NOTA'}</button>
      </div>
      {showInput && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 w-72 animate-in fade-in zoom-in duration-200">
          <form onSubmit={addNote} className="bg-yellow-100 p-4 shadow-[0_10px_20px_rgba(0,0,0,0.3)] rotate-1 border-t-8 border-yellow-200/50">
            <div className="w-4 h-4 rounded-full bg-red-600 mx-auto mb-3 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]"></div>
            <textarea autoFocus className="w-full bg-transparent outline-none text-gray-800 text-lg resize-none placeholder-gray-500/50 font-medium h-32" placeholder="Escribe algo..." value={newNoteText} onChange={e => setNewNoteText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(e); } }} />
            <button type="submit" className="w-full mt-2 bg-[#8b5a2b] text-white text-sm font-bold py-2 rounded shadow hover:bg-[#6d4621] transition">FIJAR NOTA</button>
          </form>
        </div>
      )}
      <div className={`grid ${styles.grid} gap-4 transition-all duration-500 ease-in-out`}>
        {notes.map((note) => (
          <div key={note.id} className={`relative shadow-[2px_2px_8px_rgba(0,0,0,0.15)] transition-transform hover:scale-105 duration-300 group ${note.color} ${styles.card} flex items-center justify-center text-center overflow-hidden`} style={{ transform: `rotate(${note.rotation}deg)` }}>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full shadow-[1px_1px_2px_rgba(0,0,0,0.3)] z-10 border border-red-800"></div>
            <p className={`text-gray-800 font-medium leading-snug break-words w-full ${styles.text}`}>{note.text}</p>
            <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="absolute -bottom-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold shadow-lg hover:bg-red-600 hover:scale-110 cursor-pointer" title="Quitar">✕</button>
          </div>
        ))}
      </div>
      {notes.length === 0 && !showInput && (
        <div className="flex-1 flex flex-col items-center justify-center text-[#8b5a2b]/30 pointer-events-none select-none min-h-[200px]"><p className="text-6xl mb-2">📌</p><p className="font-bold uppercase tracking-widest text-xl">VACÍO</p></div>
      )}
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
        className="p-6 rounded-2xl text-white shadow-lg flex flex-col h-[400px] border