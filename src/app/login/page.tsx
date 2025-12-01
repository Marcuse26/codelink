'use client';

import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { auth, db } from '../../firebase/config';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      if (isRegistering) {
        // REGISTRO
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `usernames/${username.toLowerCase()}`));

        if (snapshot.exists()) {
          throw new Error("Este nombre de usuario ya está ocupado.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await set(ref(db, 'usernames/' + username.toLowerCase()), {
          email: email,
          uid: user.uid
        });

        await updateProfile(user, { displayName: username });
        await sendEmailVerification(user);
        await signOut(auth);

        setMessage(`¡Cuenta creada! Se ha enviado un correo a ${email}. Verifícalo.`);
        setIsRegistering(false);
        setPassword('');

      } else {
        // LOGIN
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `usernames/${username.toLowerCase()}`));

        if (!snapshot.exists()) {
          throw new Error("El nombre de usuario no existe.");
        }

        const registeredEmail = snapshot.val().email;
        const userCredential = await signInWithEmailAndPassword(auth, registeredEmail, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          await signOut(auth);
          throw new Error("Tu correo no ha sido verificado aún.");
        }

        router.push('/');
      }

    } catch (err: any) {
      console.error(err);
      if (err.message) setError(err.message);
      else setError('Ocurrió un error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm border-l-4 border-red-500">{error}</p>}
        {message && <p className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm border-l-4 border-green-500">{message}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de Usuario</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="ej: marcos123" required />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="tu@email.com" required />
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="******" required />
          </div>
          
          <button type="submit" disabled={loading} className={`w-full text-white font-bold py-3 rounded-lg transition shadow-lg ${loading ? 'bg-gray-400' : 'bg-pink-600 hover:bg-pink-700'}`}>
            {loading ? 'Procesando...' : (isRegistering ? 'Crear Cuenta y Verificar' : 'Entrar')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); setMessage(''); }} className="text-pink-600 font-bold ml-1 hover:underline focus:outline-none">
            {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}