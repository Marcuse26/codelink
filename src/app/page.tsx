'use client';

import { useState, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signOut 
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Para mensajes de éxito
  const [captchaValido, setCaptchaValido] = useState(false); // Estado del captcha
  
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();

  // --- PEGA AQUÍ TU CLAVE DE SITIO DE GOOGLE reCAPTCHA ---
  const RECAPTCHA_SITE_KEY = "6LdCnR0sAAAAAC3pk4NAR6_CjNq9E_pAHrzVreAG"; 
  // -----------------------------------------------------

  const handleCaptchaChange = (token: string | null) => {
    if (token) {
      setCaptchaValido(true);
    } else {
      setCaptchaValido(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validación de Captcha (Solo obligatorio al registrarse)
    if (isRegistering && !captchaValido) {
      setError('Por favor, completa el Captcha para demostrar que eres humano.');
      return;
    }
    
    try {
      if (isRegistering) {
        // 1. CREAR CUENTA
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. ENVIAR CORREO DE VERIFICACIÓN
        await sendEmailVerification(user);

        // 3. CERRAR SESIÓN (Para obligar a que verifiquen antes de entrar)
        await signOut(auth);

        setMessage('¡Cuenta creada! Hemos enviado un enlace de verificación a tu correo. Por favor, verifícalo antes de iniciar sesión.');
        setIsRegistering(false); // Volver a la pantalla de login
        setCaptchaValido(false); // Resetear captcha
        if (recaptchaRef.current) recaptchaRef.current.reset();

      } else {
        // LOGICA DE INICIO DE SESIÓN
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 4. VERIFICAR SI EL EMAIL ESTÁ VALIDADO
        if (!user.emailVerified) {
          await signOut(auth); // Le echamos si no ha verificado
          setError('Tu correo no ha sido verificado aún. Revisa tu bandeja de entrada (y spam).');
          return;
        }

        // Si todo está bien y verificado:
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Ese correo ya está registrado.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Inténtalo más tarde.');
      } else {
        setError('Ocurrió un error: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isRegistering ? 'Crear Cuenta CodeLink' : 'Iniciar Sesión'}
        </h2>
        
        {/* Mensajes de Error y Éxito */}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm border-l-4 border-red-500">{error}</p>}
        {message && <p className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm border-l-4 border-green-500">{message}</p>}

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

          {/* CAPTCHA (Solo visible al registrarse) */}
          {isRegistering && (
            <div className="flex justify-center my-4">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
              />
            </div>
          )}
          
          <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition shadow-lg">
            {isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setMessage('');
            }} 
            className="text-pink-600 font-bold ml-1 hover:underline focus:outline-none"
          >
            {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}