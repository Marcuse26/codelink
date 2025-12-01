'use client';

import '../globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../firebase/config';

const inter = Inter({ subsets: ['latin'] });

// --- ICONOS ---
const Icons = {
  Agenda: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Habits: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sport: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Heart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [appUser, setAppUser] = useState<string>('Usuario');

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  // Obtener nombre real desde la base de datos si existe
  useEffect(() => {
    if (user?.displayName) {
      setAppUser(user.displayName);
    }
  }, [user]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#1a1a2e]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div></div>;
  if (pathname === '/login') return <main className="min-h-screen w-full bg-[#1a1a2e]">{children}</main>;
  if (!user) return null;

  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[260px] flex flex-col justify-between border-r border-[#e9ecef] bg-white p-5 shrink-0">
        <div>
          <div className="mb-8 flex justify-center py-4 border-b border-[#f1f3f5]">
            <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              CodeLink 💖
            </h1>
          </div>

          <h2 className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-gray-500">General</h2>
          <nav className="space-y-1">
            <SidebarLink href="/" active={pathname === '/'} icon={<Icons.Agenda />} label="Agenda" />
            <SidebarLink href="/habitos" active={pathname === '/habitos'} icon={<Icons.Habits />} label="Hábitos" />
            <SidebarLink href="/deporte" active={pathname === '/deporte'} icon={<Icons.Sport />} label="Deporte" />
            <SidebarLink href="/calendario" active={pathname === '/calendario'} icon={<Icons.Heart />} label="Nosotros" />
          </nav>

          <h2 className="mb-3 mt-6 px-3 text-xs font-bold uppercase tracking-widest text-gray-500">Configuración</h2>
          <nav className="space-y-1">
             <SidebarLink href="/config" active={pathname === '/config'} icon={<Icons.Settings />} label="Ajustes" />
          </nav>
        </div>

        <div>
          <div className="mt-4 border-t border-[#e9ecef] pt-4 text-center">
            <p className="text-sm text-gray-600">Hola, <strong>{appUser}</strong></p>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex flex-1 flex-col overflow-hidden bg-[#f0f2f5]">
        <header className="flex h-[80px] shrink-0 items-center justify-between border-b border-[#e9ecef] bg-white px-8">
          <h1 className="text-2xl font-bold text-[#212529]">
            {pathname === '/' ? 'Agenda' : 
             pathname === '/habitos' ? 'Hábitos' : 
             pathname === '/deporte' ? 'Deporte' : 
             pathname === '/calendario' ? 'Nosotros' : 'Ajustes'}
          </h1>
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
            <Icons.Logout /> Salir
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
           <div className="mx-auto max-w-6xl">
              {children}
           </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ href, active, icon, label }: any) => (
  <Link href={href} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[15px] transition-all duration-200 ${active ? 'bg-pink-50 text-pink-600 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
    <span className={active ? 'text-pink-600' : 'text-gray-400'}>{icon}</span> {label}
  </Link>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}><AuthProvider><MainLayout>{children}</MainLayout></AuthProvider></body>
    </html>
  );
}