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

// Iconos SVG Limpios
const Icons = {
  Academic: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
  Habits: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sport: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Heart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
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
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (pathname === '/login') {
    return <main className="w-full min-h-screen bg-[#1a1a2e]">{children}</main>;
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#1a1a2e] text-white">
      
      {/* --- BARRA LATERAL (SIDEBAR) --- */}
      <aside className="w-64 bg-black/20 border-r border-white/5 backdrop-blur-xl flex flex-col justify-between shrink-0 fixed h-full z-50">
        <div>
          {/* Cabecera */}
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <h1 className="text-xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              CodeLink
            </h1>
          </div>

          {/* Menú */}
          <nav className="p-4 space-y-1 mt-4">
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">General</p>
            <SidebarLink href="/" active={pathname === '/'} icon={<Icons.Academic />} label="Académico" />
            <SidebarLink href="/habitos" active={pathname === '/habitos'} icon={<Icons.Habits />} label="Hábitos" />
            <SidebarLink href="/deporte" active={pathname === '/deporte'} icon={<Icons.Sport />} label="Deporte" />
            <SidebarLink href="/calendario" active={pathname === '/calendario'} icon={<Icons.Heart />} label="Nosotros" />
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Admin</p>
          <SidebarLink href="/config" active={pathname === '/config'} icon={<Icons.Settings />} label="Ajustes" />
          <button 
            onClick={() => signOut(auth)} 
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <Icons.Logout />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 ml-64 min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#131325]">
        <div className="max-w-7xl mx-auto p-8 md:p-12">
          {children}
        </div>
      </main>

    </div>
  );
};

// Componente de Enlace Lateral
const SidebarLink = ({ href, active, icon, label }: any) => (
  <Link 
    href={href} 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
      active 
        ? 'bg-gradient-to-r from-pink-600/90 to-purple-600/90 text-white shadow-lg shadow-pink-500/20' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>{icon}</span>
    {label}
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