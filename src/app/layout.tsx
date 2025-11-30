'use client'; // Importante porque usamos AuthContext y hooks

import './globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const inter = Inter({ subsets: ['latin'] });

// Componente interno para manejar la protección de rutas
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando CodeLink...</div>;

  // Si no hay usuario y no estamos en login, no mostramos nada (el useEffect redirige)
  if (!user && pathname !== '/login') return null;

  // Si estamos en login, mostramos solo el contenido (sin navbar)
  if (pathname === '/login') return <>{children}</>;

  return (
    <>
      <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4 md:space-x-6 overflow-x-auto">
             {/* Enlaces más pequeños para móvil */}
            <Link href="/" className="text-white hover:text-pink-400 font-semibold text-sm md:text-lg">🎓 Agenda</Link>
            <Link href="/habitos" className="text-white hover:text-pink-400 font-semibold text-sm md:text-lg">✅ Hábitos</Link>
            <Link href="/deporte" className="text-white hover:text-pink-400 font-semibold text-sm md:text-lg">🏃 Strava</Link>
            <Link href="/calendario" className="text-white hover:text-pink-400 font-semibold text-sm md:text-lg">💖 Calendario</Link>
          </div>
          
          <button 
            onClick={() => signOut(auth)}
            className="bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm px-3 py-2 rounded ml-2"
          >
            Salir
          </button>
        </div>
      </nav>
      <main className="container mx-auto p-4 pt-8 min-h-screen">
        {children}
      </main>
    </>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}