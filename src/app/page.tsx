'use client';

import React from 'react';

// Datos de ejemplo para el Heatmap (Días de la semana)
const heatmapData = [
  { dia: 'L', yo: 0.9, ella: 0.8 },
  { dia: 'M', yo: 0.5, ella: 1.0 },
  { dia: 'X', yo: 1.0, ella: 0.7 },
  { dia: 'J', yo: 0.3, ella: 0.9 },
  { dia: 'V', yo: 0.8, ella: 0.5 },
  { dia: 'S', yo: 0.6, ella: 0.4 },
  { dia: 'D', yo: 0.2, ella: 0.1 },
];

// Función para determinar el color según el porcentaje
const getColorIntensity = (value: number) => {
  if (value >= 0.9) return 'bg-green-600'; // 90-100%
  if (value >= 0.7) return 'bg-yellow-500'; // 70-89%
  if (value >= 0.4) return 'bg-orange-400'; // 40-69%
  return 'bg-red-500'; // < 40%
};

// Componente para el Área de Tareas
const TareaArea = ({ label, bgColor, link }: { label: string, bgColor: string, link: string }) => (
    <div className={`w-1/2 p-6 rounded-xl shadow-lg ${bgColor}`}>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{label}</h2>
        <p className="text-gray-700 mb-4">
            Aquí puedes pegar las tareas de la semana, entregas y eventos.
        </p>
        <a href={link} target="_blank" rel="noopener noreferrer" className="w-full py-2 block text-center bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition">
            Ir a Trello/Notion
        </a>
    </div>
);

export default function AgendaPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-900">🎓 Agenda y Progreso Universitario</h1>

      {/* Tareas y Eventos Individuales */}
      <div className="flex space-x-8">
        <TareaArea 
            label="Mi Espacio" 
            bgColor="bg-blue-100" 
            link="#"
        />
        <TareaArea 
            label="Su Espacio" 
            bgColor="bg-red-100" 
            link="#"
        />
      </div>

      {/* Heatmap Conjunto (Progreso Diario) */}
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Progreso Académico Conjunto</h2>
        <div className="flex justify-center space-x-4">
          {heatmapData.map((item) => (
            <div key={item.dia} className="flex flex-col items-center">
              <span className="text-sm font-semibold mb-2">{item.dia}</span>
              
              {/* Bloque de Ella */}
              <div
                className={`w-10 h-10 rounded-lg shadow-md mb-2 cursor-pointer transition transform hover:scale-110 ${getColorIntensity(item.ella)}`}
                title={`Su progreso el ${item.dia}: ${Math.round(item.ella * 100)}%`}
              ></div>
              
              {/* Bloque Mío */}
              <div
                className={`w-10 h-10 rounded-lg shadow-md cursor-pointer transition transform hover:scale-110 ${getColorIntensity(item.yo)}`}
                title={`Mi progreso el ${item.dia}: ${Math.round(item.yo * 100)}%`}
              ></div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
            Arriba: Ella | Abajo: Tú <br/>
            (Verde = Muy productivo, Rojo = Poco productivo)
        </p>
      </div>
    </div>
  );
}
}