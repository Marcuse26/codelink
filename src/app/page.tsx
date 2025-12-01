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

// --- Componente de Lista de Tareas (Reutilizable) ---
const TodoCard = ({ title, dbPath, colorGradient }: { title: string, dbPath: string, colorGradient: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // Cargar tareas de Firebase en tiempo real
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

  // Añadir tarea
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    push(ref(db, dbPath), {
      text: newTask,
      completed: false
    });
    setNewTask('');
  };

  // Tachar/Destachar tarea
  const toggleTask = (task: Task) => {
    update(ref(db, `${dbPath}/${task.id}`), {
      completed: !task.completed
    });
  };

  // Borrar tarea
  const deleteTask = (id: string) => {
    remove(ref(db, `${dbPath}/${id}`));
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorGradient} text-white shadow-lg flex flex-col h-[400px]`}>
      <h3 className="text-2xl font-bold mb-4">Tareas de {title}</h3>
      
      {/* Input */}
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
          className="w-full bg-white/20 placeholder-white/60 text-white rounded-lg px-3 py-2 outline-none focus:bg-white/30 transition text-sm"
        />
        <button type="submit" className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition">
          ➕
        </button>
      </form>

      {/* Lista con scroll */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {tasks.length === 0 && <p className="text-white/50 text-sm text-center mt-10">No hay tareas pendientes</p>}
        
        {tasks.map((task) => (
          <div key={task.id} className="group flex items-center justify-between bg-black/20 p-2 rounded-lg hover:bg-black/30 transition">
            <div 
              onClick={() => toggleTask(task)} 
              className="flex items-center gap-3 cursor-pointer flex-1"
            >
              <div className={`w-5 h-5 rounded border border-white/50 flex items-center justify-center ${task.completed ? 'bg-white text-blue-600' : 'bg-transparent'}`}>
                {task.completed && <span className="text-xs font-bold">✓</span>}
              </div>
              <span className={`text-sm ${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
                {task.text}
              </span>
            </div>
            <button 
              onClick={() => deleteTask(task.id)}
              className="text-white/40 hover:text-red-300 opacity-0 group-hover:opacity-100 transition px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Componente Principal ---

// Datos fijos del Heatmap (puntos)
const heatmapData = [
  { dia: 'L', yo: 0.9, ella: 0.8 }, { dia: 'M', yo: 0.5, ella: 1.0 },
  { dia: 'X', yo: 1.0, ella: 0.7 }, { dia: 'J', yo: 0.3, ella: 0.9 },
  { dia: 'V', yo: 0.8, ella: 0.5 }, { dia: 'S', yo: 0.6, ella: 0.4 },
  { dia: 'D', yo: 0.2, ella: 0.1 },
];

const getColor = (v: number) => {
    if (v >= 0.9) return 'bg-[#4ade80] shadow-[0_0_10px_#4ade80]'; 
    if (v >= 0.7) return 'bg-[#86efac]'; 
    if (v >= 0.4) return 'bg-[#166534]'; 
    return 'bg-white/10'; 
};

export default function AgendaPage() {
  const [names, setNames] = useState({ user1: 'Usuario 1', user2: 'Usuario 2' });

  // Obtener nombres reales de la configuración
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
      
      {/* HEATMAP LIMPIO */}
      <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[250px]">
        <h2 className="text-xl font-bold text-white mb-8 self-start px-4">Mapa de Actividad</h2>
        
        {/* Contenedor de puntos */}
        <div className="flex gap-6">
            {heatmapData.map((d, i) => (
                <div key={i} className="flex flex-col gap-4">
                    {/* Punto Arriba (Ella/Él) */}
                    <div 
                        className={`w-12 h-12 rounded-xl transition-all duration-500 ${getColor(d.ella)}`} 
                        title={`Nivel: ${Math.round(d.ella * 100)}%`}
                    ></div>
                    
                    {/* Punto Abajo (Tú) */}
                    <div 
                        className={`w-12 h-12 rounded-xl transition-all duration-500 ${getColor(d.yo)}`} 
                        title={`Nivel: ${Math.round(d.yo * 100)}%`}
                    ></div>
                </div>
            ))}
        </div>
      </div>

      {/* LISTAS DE TAREAS INTERACTIVAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodoCard 
          title={names.user1} 
          dbPath="tasks/user1" 
          colorGradient="from-blue-600 to-blue-800"
        />
        <TodoCard 
          title={names.user2} 
          dbPath="tasks/user2" 
          colorGradient="from-purple-600 to-purple-800" 
        />
      </div>
    </div>
  );
}