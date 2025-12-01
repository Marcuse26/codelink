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
  // --- LÓGICA DE FIREBASE (INTACTA) ---
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
          throw new Error("Ese usuario ya existe, pilla otro.");
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

        setMessage(`¡Listo! Te hemos enviado un correo a ${email}. Confírmalo para entrar.`);
        setIsRegistering(false);
        setPassword('');

      } else {
        // LOGIN
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `usernames/${username.toLowerCase()}`));

        if (!snapshot.exists()) {
          throw new Error("Ese usuario no existe.");
        }

        const registeredEmail = snapshot.val().email;
        const userCredential = await signInWithEmailAndPassword(auth, registeredEmail, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          await signOut(auth);
          throw new Error("¡Oye! Aún no has verificado tu correo.");
        }

        router.push('/');
      }

    } catch (err: any) {
      console.error(err);
      // Mensajes más informales
      if (err.message.includes("ocupado") || err.message.includes("existe")) setError(err.message);
      else if (err.code === 'auth/wrong-password') setError('Contraseña incorrecta. Inténtalo otra vez.');
      else if (err.code === 'auth/email-already-in-use') setError('Ese correo ya está pillado.');
      else setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- NUEVO DISEÑO VISUAL (GLASSMORPHISM) ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-600"></div>

        <h2 className="text-4xl font-black text-center mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          CodeLink
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm uppercase tracking-widest">
          {isRegistering ? 'Únete al equipo' : 'Acceso Restringido'}
        </p>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-4 text-sm text-center font-medium backdrop-blur-sm">{error}</div>}
        {message && <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-xl mb-4 text-sm text-center font-medium backdrop-blur-sm">{message}</div>}

        <form onSubmit={handleAuth} className="space-y-5">
          
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-1 ml-1 uppercase">Usuario</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="glass-input w-full p-4 rounded-xl" 
              placeholder="Tu apodo" 
              required 
            />
          </div>

          {isRegistering && (
            <div className="animate-fade-in-down">
              <label className="block text-gray-300 text-xs font-bold mb-1 ml-1 uppercase">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="glass-input w-full p-4 rounded-xl" 
                placeholder="correo@real.com" 
                required 
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-xs font-bold mb-1 ml-1 uppercase">Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="glass-input w-full p-4 rounded-xl" 
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full btn-neon py-4 rounded-xl shadow-lg mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Cargando...' : (isRegistering ? 'Crear Cuenta' : 'Entrar')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-400">
            {isRegistering ? '¿Ya estás dentro?' : '¿Eres nuevo?'}
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); setMessage(''); }} 
              className="text-pink-400 font-bold ml-2 hover:text-pink-300 hover:underline transition"
            >
              {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}