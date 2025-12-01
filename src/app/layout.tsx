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

// Iconos
const Icons = {
  Academic: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
  Habits: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sport: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Heart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>,
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e]"><div className="w-12 h-12 border-4 border-pink-500 rounded-full animate-spin border-t-transparent"></div></div>;
  if (!user && pathname !== '/login') return null;
  if (pathname === '/login') return <main>{children}</main>;

  return (
    <>
      <main className="container mx-auto p-4 pb-32 min-h-screen">{children}</main>
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
        <nav className="glass-panel px-4 py-3 flex items-center space-x-2 sm:space-x-4 shadow-2xl bg-black/80 border border-white/10 backdrop-blur-xl rounded-full">
          <NavLink href="/" active={pathname === '/'} icon={<Icons.Academic />}>Académico</NavLink>
          <NavLink href="/habitos" active={pathname === '/habitos'} icon={<Icons.Habits />}>Hábitos</NavLink>
          <NavLink href="/deporte" active={pathname === '/deporte'} icon={<Icons.Sport />}>Deporte</NavLink>
          <NavLink href="/calendario" active={pathname === '/calendario'} icon={<Icons.Heart />}>Nosotros</NavLink>
          <div className="w-px h-6 bg-white/20 mx-2"></div>
          <Link href="/config/page" className="p-2 text-gray-400 hover:text-white"><Icons.Settings /></Link>
          <button onClick={() => signOut(auth)} className="p-2 text-red-400 hover:text-red-500"><Icons.Logout /></button>
        </nav>
      </div>
    </>
  );
};

const NavLink = ({ href, active, children, icon }: any) => (
  <Link href={href} className={`px-3 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${active ? 'bg-pink-600 text-white' : 'text-gray-400'}`}>
    {icon} <span className="hidden sm:inline">{children}</span>
  </Link>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider><MainLayout>{children}</MainLayout></AuthProvider>
      </body>
    </html>
  );
}