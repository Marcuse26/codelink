'use client';

import React, { useEffect, useState } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from '../firebase/config';

// --- Tipos para Tareas ---
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

// --- Componente Calendario (Nuevo) ---
const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Nombres de meses y días
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  // Cálculos de fecha
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Ajustar para que la semana empiece en Lunes (0) en vez de Domingo
  let startDay = new Date(year, month, 1).getDay(); 
  startDay = startDay === 0 ? 6 : startDay - 1; 

  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  // Generar array de días (incluyendo espacios vacíos)
  const daysArray = [];
  for (let i = 0; i < startDay; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  return (
    <div className="glass-card p-8 flex flex-col min-h-[300px] w-full">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
          {months[month]} <span className="text-pink-400">{year}</span>
        </h2>
        <div className="text-white/50 text-sm font-medium">
            Hoy es {today.getDate()}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 text-center">
        {/* Cabecera Dias */}
        {weekDays.map(day => (
            <div key={day} className="text-gray-400 font-bold text-sm mb-2">{day}</div>
        ))}

        {/* Días del mes */}
        {daysArray.map((day, index) => {
            const isToday = isCurrentMonth && day === today.getDate();
            return (
                <div key={index} className="flex justify-center items-center h-10">
                    {day ? (
                        <div className={`
                            w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300
                            ${isToday 
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-110' 
                                : 'text-white hover:bg-white/10'
                            }
                        `}>
                            {day}
                        </div>
                    ) : (
                        <span></span>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

// --- Componente Lista de Tareas (Existente) ---
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

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
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
      {/* CALENDARIO */}
      <CalendarWidget />

      {/* LISTAS DE TAREAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodoCard title={names.user1} dbPath="tasks/user1" colorGradient="from-blue-600 to-blue-800" />
        <TodoCard title={names.user2} dbPath="tasks/user2" colorGradient="from-purple-600 to-purple-800" />
      </div>
    </div>
  );
}