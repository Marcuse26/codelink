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
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isRegister, setIsRegister] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `usernames/${username.toLowerCase()}`));

        if (!snapshot.exists()) {
          throw new Error("No existe ninguna cuenta con ese nombre de usuario.");
        }

        const registeredEmail = snapshot.val().email;

        await sendPasswordResetEmail(auth, registeredEmail);
        alert(`¡Correo enviado! Revisa la bandeja de entrada de ${registeredEmail} para restablecer tu contraseña.`);
        setIsRecovering(false);

    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1a1a2e]">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="flex flex-col items-center justify-center mb-8 relative z-10">
            {/* CORRECCIÓN IMAGEN: Tamaños explícitos y ruta relativa */}
            <div className="relative w-64 h-32 mb-4">
                <Image
                    src="/logo.png" 
                    alt="CodeLink Logo"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">
                {isRecovering ? 'RECUPERAR CONTRASEÑA' : (isRegister ? 'CREAR NUEVA CUENTA' : '')}
            </p>
        </div>
        
        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-xl mb-6 text-center text-sm font-medium border border-red-500/20 animate-pulse">{error}</div>}

        <form onSubmit={isRecovering ? handleResetPassword : handleAuth} className="space-y-5 relative z-10">
          
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