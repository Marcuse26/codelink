'use client';

import '../globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const inter = Inter({ subsets: ['latin'] });

// --- ICONOS ---
const Icons = {
  Academic: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>,
  Habits: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sport: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Heart: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Settings: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>,
  Logout: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
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

  useEffect(() => {
    if (user?.displayName) {
      setAppUser(user.displayName);
    }
  }, [user]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#1a1a2e]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div></div>;
  if (pathname === '/login') return <main className="min-h-screen w-full bg-[#1a1a2e]">{children}</main>;
  if (!user) return null;

  return (
    <div className="flex h-screen w-full max-w-[100vw] bg-[#f0f2f5] font-sans overflow-hidden">
      
      {/* SIDEBAR (Escritorio) */}
      <aside className="hidden md:flex w-[260px] flex-col justify-between border-r border-[#e9ecef] bg-white p-5 shrink-0">
        <div>
          <div className="mb-8 flex justify-center py-4 border-b border-[#f1f3f5]">
            <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              CodeLink 💖
            </h1>
          </div>
          <nav className="space-y-1">
            <SidebarLink href="/" active={pathname === '/'} icon={<Icons.Academic />} label="ACADÉMICO" />
            <SidebarLink href="/deporte" active={pathname === '/deporte'} icon={<Icons.Sport />} label="DEPORTE" />
            <SidebarLink href="/habitos" active={pathname === '/habitos'} icon={<Icons.Habits />} label="HÁBITOS" />
            <SidebarLink href="/calendario" active={pathname === '/calendario'} icon={<Icons.Heart />} label="PLANING" />
            <SidebarLink href="/config" active={pathname === '/config'} icon={<Icons.Settings />} label="AJUSTES" />
          </nav>
        </div>
        <div>
          <button onClick={() => signOut(auth)} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-semibold text-red-600 hover:bg-red-50 transition-all duration-200">
            <Icons.Logout /> SALIR
          </button>
          <div className="mt-2 border-t border-[#e9ecef] pt-4 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Hola, <strong>{appUser}</strong></p>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex flex-1 flex-col min-w-0 overflow-hidden bg-[#f0f2f5] relative">
        
        {/* BARRA INFERIOR (Móvil) - DISEÑO IMPACT */}
        <div className="md:hidden w-full h-[65px] shrink-0 flex items-stretch justify-center z-50 border-t-2 border-b-2 border-black bg-orange-500">
            
            <BottomNavLink href="/" active={pathname === '/'} label="ACAD." />
            <BottomNavLink href="/deporte" active={pathname === '/deporte'} label="SPORT" />
            <BottomNavLink href="/habitos" active={pathname === '/habitos'} label="HABIT" />
            <BottomNavLink href="/calendario" active={pathname === '/calendario'} label="PLAN" />
            <BottomNavLink href="/config" active={pathname === '/config'} label="CONF" />
            
            {/* BOTÓN SALIR */}
            <button 
                onClick={() => signOut(auth)} 
                className="flex-1 flex items-center justify-center bg-red-600 border-l-2 border-black active:bg-red-700 transition-colors"
            >
                <span className="text-sm font-black text-black uppercase tracking-tighter transform scale-y-110">SALIR</span>
            </button>
        </div>

        {/* ÁREA DE CONTENIDO */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
           <div className="mx-auto max-w-6xl pt-2 md:pt-0">
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

// Componente Enlace Móvil
const BottomNavLink = ({ href, active, label }: any) => (
    <Link 
        href={href} 
        className={`
            flex-1 flex items-center justify-center 
            border-r-2 border-black
            transition-all duration-200
            ${active ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-400'}
        `}
    >
      <span className="text-sm font-black text-black uppercase tracking-tighter transform scale-y-110">
        {label}
      </span>
    </Link>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>CodeLink</title>
        <meta name="description" content="Tu espacio compartido" />
        
        {/* CORRECCIÓN: Forzamos la actualización usando '?v=4' */}
        {/* Esto obliga al navegador a recargar el logo.png correcto */}
        <link rel="icon" type="image/png" href="/logo.png?v=4" />
        <link rel="apple-touch-icon" href="/logo.png?v=4" />
        
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}