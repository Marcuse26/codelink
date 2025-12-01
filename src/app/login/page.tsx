'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message.includes('auth') ? 'Credenciales incorrectas' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1a1a2e]">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">CodeLink 💖</h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            {isRegister ? 'Crear Nueva Cuenta' : 'Acceso Privado'}
          </p>
        </div>
        
        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-xl mb-6 text-center text-sm font-medium border border-red-500/20">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition focus:ring-1 focus:ring-pink-500" 
              placeholder="Correo electrónico" 
              required 
            />
          </div>
          <div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition focus:ring-1 focus:ring-pink-500" 
              placeholder="Contraseña" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-pink-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Conectando...' : (isRegister ? 'Registrarse' : 'Entrar')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(''); }} 
            className="text-gray-400 hover:text-white text-sm font-medium transition flex items-center justify-center mx-auto gap-2 group"
          >
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <span className="text-pink-400 group-hover:underline">{isRegister ? 'Inicia sesión' : 'Regístrate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}