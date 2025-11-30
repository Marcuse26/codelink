'use client';

import React from 'react';
import { RachaData } from '@/data/racha';

export default function DeportePage() {
    // Si RachaData no existe o está vacío, usamos valores por defecto para evitar errores
    const miRacha = RachaData?.miRacha || 0;
    const suRacha = RachaData?.suRacha || 0;
    const rachaConjunta = miRacha + suRacha; 

    const handleStreakUpdate = (user: string) => {
        alert(`¡Racha de ${user} activada! Recuerda editar el archivo src/data/racha.ts para guardar el cambio real.`);
    };

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-extrabold text-center text-gray-900">🏃 Rendimiento Deportivo (Strava)</h1>
            
            {/* Racha Conjunta */}
            <div className="text-center bg-green-100 p-8 rounded-2xl shadow-xl border-t-4 border-green-500">
                <p className="text-lg font-semibold text-green-700 mb-2">Días de Deporte Juntos</p>
                <div className="text-7xl font-extrabold text-green-900">{rachaConjunta}</div>
                <p className="text-xl font-medium text-gray-600 mt-2">Días de racha acumulados en total.</p>
            </div>

            {/* Marcas de Racha Individuales */}
            <div className="flex justify-around">
                <div className="w-5/12 bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Mi Racha: {miRacha} días</h2>
                    <button onClick={() => handleStreakUpdate("MÍO")} className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">Activar Racha</button>
                </div>

                <div className="w-5/12 bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Su Racha: {suRacha} días</h2>
                     <button onClick={() => handleStreakUpdate("SUYO")} className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition">Activar Racha</button>
                </div>
            </div>
            
             <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 mb-4">Perfiles de Strava:</p>
                <div className="flex justify-center space-x-6">
                    <a href="#" className="py-2 px-4 bg-orange-500 text-white rounded-lg">Mi Perfil</a>
                    <a href="#" className="py-2 px-4 bg-orange-500 text-white rounded-lg">Su Perfil</a>
                </div>
            </div>
        </div>
    );
}