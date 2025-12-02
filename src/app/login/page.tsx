'use client';

import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { auth, db } from '../../firebase/config';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isRegister, setIsRegister] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false); // Nuevo estado para recuperación
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        // --- REGISTRO ---
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `usernames/${username.toLowerCase()}`));

        if (snapshot.exists()) {
          throw new Error("Ese usuario ya existe, elige otro.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await set(ref(db, 'usernames/' + username.toLowerCase()), {
          email: email,
          uid: user.uid
        });

        await updateProfile(user, { displayName: username });
        router.push('/');

      } else {
        // --- LOGIN ---
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `usernames/${username.toLowerCase()}`));

        if (!snapshot.exists()) {
          throw new Error("Usuario no encontrado.");
        }

        const registeredEmail = snapshot.val().email;
        await signInWithEmailAndPassword(auth, registeredEmail, password);
        router.push('/');
      }

    } catch (err: any) {
      console.error(err);
      if (err.message.includes('auth/wrong-password')) setError('Contraseña incorrecta');
      else if (err.message.includes('auth/email-already-in-use')) setError('El email ya está en uso');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE RECUPERACIÓN ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        // 1. Buscar el email del usuario
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `usernames/${username.toLowerCase()}`));

        if (!snapshot.exists()) {
          throw new Error("No existe ninguna cuenta con ese nombre de usuario.");
        }

        const registeredEmail = snapshot.val().email;

        // 2. Enviar correo de reset
        await sendPasswordResetEmail(auth, registeredEmail);
        alert(`¡Correo enviado! Revisa la bandeja de entrada de ${registeredEmail} para restablecer tu contraseña.`);
        setIsRecovering(false); // Volver al login

    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1a1a2e]">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden">
        
        {/* Decoración */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">CodeLink 💖</h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            {isRecovering ? 'Recuperar Contraseña' : (isRegister ? 'Crear Nueva Cuenta' : 'Acceso Privado')}
          </p>
        </div>
        
        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-xl mb-6 text-center text-sm font-medium border border-red-500/20 animate-pulse">{error}</div>}

        <form onSubmit={isRecovering ? handleResetPassword : handleAuth} className="space-y-5 relative z-10">
          
          {/* USUARIO (Siempre visible) */}
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-1 ml-1 uppercase">Nombre de Usuario</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition focus:ring-1 focus:ring-pink-500" 
              placeholder="Ej: Marcos" 
              required 
            />
          </div>

          {/* EMAIL (Solo Registro) */}
          {isRegister && !isRecovering && (
            <div className="animate-fade-in-down">
              <label className="block text-gray-400 text-xs font-bold mb-1 ml-1 uppercase">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition focus:ring-1 focus:ring-pink-500" 
                placeholder="correo@ejemplo.com" 
                required={isRegister} 
              />
            </div>
          )}

          {/* CONTRASEÑA (Solo Login y Registro, NO en Recuperación) */}
          {!isRecovering && (
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-1 ml-1 uppercase">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition focus:ring-1 focus:ring-pink-500" 
                placeholder="••••••••" 
                required={!isRecovering} 
              />
            </div>
          )}

          {/* Enlace Olvidé contraseña (Solo en Login) */}
          {!isRegister && !isRecovering && (
            <div className="flex justify-end">
                <button 
                    type="button" 
                    onClick={() => { setError(''); setIsRecovering(true); }}
                    className="text-pink-400 text-xs font-bold hover:text-pink-300 hover:underline transition"
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-pink-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
          >
            {loading ? 'Procesando...' : (isRecovering ? 'Enviar Correo de Recuperación' : (isRegister ? 'Registrarse' : 'Entrar'))}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          {isRecovering ? (
             <button 
                onClick={() => { setIsRecovering(false); setError(''); }} 
                className="text-gray-400 hover:text-white text-sm font-medium transition flex items-center justify-center mx-auto gap-2"
             >
                ← Volver a Iniciar Sesión
             </button>
          ) : (
            <button 
                onClick={() => { setIsRegister(!isRegister); setError(''); }} 
                className="text-gray-400 hover:text-white text-sm font-medium transition flex items-center justify-center mx-auto gap-2 group"
            >
                {isRegister ? '¿Ya tienes cuenta?' : '¿Eres nuevo?'}
                <span className="text-pink-400 group-hover:underline font-bold">{isRegister ? 'Inicia sesión' : 'Regístrate aquí'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}