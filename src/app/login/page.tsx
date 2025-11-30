'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Si todo va bien, vamos a la home
      router.push('/');
    } catch (err: any) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isRegistering ? 'Crear Cuenta CodeLink' : 'Iniciar Sesión'}
        </h2>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="tu@email.com"
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="******"
              required 
            />
          </div>
          
          <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition">
            {isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="text-pink-600 font-bold ml-1 hover:underline"
          >
            {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  );
}