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
      setError(err.message.includes('auth') ? 'Error de credenciales (revisa correo/contraseña)' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1a1a2e]">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <h2 className="text-4xl font-black text-center mb-2 text-white">CodeLink 💖</h2>
        <p className="text-center text-gray-400 mb-8 text-sm uppercase tracking-widest">
          {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </p>
        
        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-xl mb-4 text-center text-sm">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-5">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition" 
            placeholder="Correo electrónico" 
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition" 
            placeholder="Contraseña" 
            required 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Entrar')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-gray-400 hover:text-pink-400 text-sm font-medium transition"
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}