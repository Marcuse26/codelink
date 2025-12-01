'use client';

import '../globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const inter = Inter({ subsets: ['latin'] });

// Iconos SVG para sustituir emojis
const Icons = {
  Home: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Habits: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sport: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Heart: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white font-medium text-sm tracking-widest uppercase">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user && pathname !== '/login') return null;

  if (pathname === '/login') {
    return <main>{children}</main>;
  }

  return (
    <>
      <main className="container mx-auto p-4 pb-32 min-h-screen">
        {children}
      </main>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
        <nav className="glass-panel px-4 py-3 sm:px-6 sm:py-3 flex items-center space-x-2 sm:space-x-4 shadow-2xl bg-black/80 border border-white/10 backdrop-blur-xl rounded-full">
          
          <NavLink href="/" active={pathname === '/'} icon={<Icons.Home />}>Agenda</NavLink>
          <NavLink href="/habitos" active={pathname === '/habitos'} icon={<Icons.Habits />}>Hábitos</NavLink>
          <NavLink href="/deporte" active={pathname === '/deporte'} icon={<Icons.Sport />}>Strava</NavLink>
          <NavLink href="/calendario" active={pathname === '/calendario'} icon={<Icons.Heart />}>Love</NavLink>
          
          <div className="w-px h-6 bg-white/20 mx-2"></div>
          
          <Link 
            href="/config" 
            className={`p-2 rounded-full transition-all duration-300 ${
              pathname === '/config' 
                ? 'bg-white text-black shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Configuración"
          >
             <Icons.Settings />
          </Link>

          <button 
            onClick={() => signOut(auth)} 
            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
            title="Cerrar Sesión"
          >
             <Icons.Logout />
          </button>
        </nav>
      </div>
    </>
  );
};

const NavLink = ({ href, active, children, icon }: { href: string, active: boolean, children: React.ReactNode, icon: React.ReactNode }) => (
  <Link 
    href={href} 
    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
      active 
        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
        : 'text-gray-400 hover:text-white hover:bg-white/10'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{children}</span>
  </Link>
);

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