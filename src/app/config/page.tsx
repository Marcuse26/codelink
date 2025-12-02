'use client';
import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { updateProfile, updatePassword, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { db, auth } from '../../firebase/config';

export default function ConfigPage() {
  const router = useRouter();
  
  const [form, setForm] = useState({ 
    user1: '', 
    user2: '', 
    color1: '#3b82f6', 
    color2: '#ec4899', 
    calendarUrl1: '', 
    calendarUrl2: '',
    sportUrl1: '',
    sportUrl2: '',
    reunionDate: '',
    eventName: '' 
  });

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUid(user.uid);
        // Cargar configuración específica del usuario
        const settingsRef = ref(db, `users/${user.uid}/settings`);
        onValue(settingsRef, (s) => {
            const data = s.val();
            if (data) setForm({ ...form, ...data });
        });
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const save = () => {
    if (!currentUid) return alert('No estás autenticado.');
    set(ref(db, `users/${currentUid}/settings`), form);
    alert('¡Ajustes guardados correctamente!');
  };

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    if (!newUsername.trim()) return alert('Escribe un nombre válido');
    
    try {
      await updateProfile(auth.currentUser, { displayName: newUsername });
      alert('Nombre de usuario actualizado con éxito.');
      setNewUsername('');
      window.location.reload();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleUpdatePassword = async () => {
    if (!auth.currentUser) return;
    if (newPassword.length < 6) return alert('La contraseña debe tener al menos 6 caracteres');

    try {
      await updatePassword(auth.currentUser, newPassword);
      alert('Contraseña actualizada. Por favor, inicia sesión de nuevo.');
      setNewPassword('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        alert('Por seguridad, cierra sesión y vuelve a entrar para cambiar la contraseña.');
      } else {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    
    const confirm1 = window.confirm('¿Estás seguro de que quieres eliminar tu cuenta?');
    if (!confirm1) return;

    const confirm2 = window.confirm('Esta acción es irreversible. ¿Seguro?');
    if (!confirm2) return;

    try {
      await deleteUser(auth.currentUser);
      alert('Cuenta eliminada.');
      router.push('/login');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        alert('Por seguridad, cierra sesión y vuelve a entrar para poder eliminar tu cuenta.');
      } else {
        alert('Error al eliminar: ' + error.message);
      }
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-2xl mx-auto pb-20">
      <h1 className="text-3xl font-black text-white text-center mb-8 uppercase">AJUSTES</h1>
      
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2 mb-4">CONFIGURACIÓN APP</h2>
        
        {/* Usuario 1 */}
        <div className="space-y-3">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Perfil 1 (Izquierda/Arriba)</label>
            <div className="flex flex-col md:flex-row gap-4">
                <input className="flex-1 p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition" placeholder="Nombre" value={form.user1} onChange={e => setForm({...form, user1: e.target.value})} />
                <input type="color" className="w-full md:w-14 h-12 rounded-xl bg-transparent cursor-pointer border-0 p-0" value={form.color1} onChange={e => setForm({...form, color1: e.target.value})} />
            </div>
            <input className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition text-sm" placeholder="URL Calendario 1" value={form.calendarUrl1} onChange={e => setForm({...form, calendarUrl1: e.target.value})} />
            <input className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition text-sm" placeholder="URL Deporte 1" value={form.sportUrl1} onChange={e => setForm({...form, sportUrl1: e.target.value})} />
        </div>

        {/* Usuario 2 */}
        <div className="space-y-3 pt-4 border-t border-white/5">
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Perfil 2 (Derecha/Abajo)</label>
            <div className="flex flex-col md:flex-row gap-4">
                <input className="flex-1 p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition" placeholder="Nombre" value={form.user2} onChange={e => setForm({...form, user2: e.target.value})} />
                <input type="color" className="w-full md:w-14 h-12 rounded-xl bg-transparent cursor-pointer border-0 p-0" value={form.color2} onChange={e => setForm({...form, color2: e.target.value})} />
            </div>
            <input className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition text-sm" placeholder="URL Calendario 2" value={form.calendarUrl2} onChange={e => setForm({...form, calendarUrl2: e.target.value})} />
            <input className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition text-sm" placeholder="URL Deporte 2" value={form.sportUrl2} onChange={e => setForm({...form, sportUrl2: e.target.value})} />
        </div>

        {/* Evento */}
        <div className="space-y-4 pt-4 border-t border-white/5">
            <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Nombre del Evento</label>
                <input type="text" placeholder="Ej: NUESTRO VIAJE" className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition" value={form.eventName} onChange={e => setForm({...form, eventName: e.target.value})} />
            </div>
            <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Fecha y Hora</label>
                <input type="datetime-local" className="w-full p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition" value={form.reunionDate} onChange={e => setForm({...form, reunionDate: e.target.value})} />
            </div>
        </div>

        <button onClick={save} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform">
            GUARDAR CONFIGURACIÓN
        </button>
      </div>

      <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-6">
        <h2 className="text-xl font-bold text-red-200 border-b border-white/10 pb-2 mb-4">MI CUENTA</h2>

        <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Cambiar mi nombre de usuario</label>
            <div className="flex gap-3">
                <input 
                    className="flex-1 p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition text-sm"
                    placeholder="Nuevo nombre"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                />
                <button onClick={handleUpdateProfile} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition">
                    ACTUALIZAR
                </button>
            </div>
        </div>

        <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Cambiar contraseña</label>
            <div className="flex gap-3">
                <input 
                    type="password"
                    className="flex-1 p-3 rounded-xl bg-black/30 text-white border border-white/10 outline-none focus:border-white/30 transition text-sm"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
                <button onClick={handleUpdatePassword} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition">
                    CAMBIAR
                </button>
            </div>
        </div>

        <div className="pt-4 mt-4 border-t border-white/5">
            <button 
                onClick={handleDeleteAccount}
                className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl font-bold text-xs tracking-widest transition uppercase"
            >
                ⚠️ Eliminar mi cuenta permanentemente
            </button>
        </div>
      </div>

    </div>
  );
}