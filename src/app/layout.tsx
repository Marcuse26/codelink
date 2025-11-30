import './globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-10">
          <div className="container mx-auto flex justify-around">
            <NavLink href="/">🎓 Agenda</NavLink>
            <NavLink href="/habitos">✅ Hábitos</NavLink>
            <NavLink href="/deporte">🏃 Strava</NavLink>
            <NavLink href="/calendario">💖 Calendario</NavLink>
          </div>
        </nav>
        <main className="container mx-auto p-4 pt-8 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

// Componente simple para los enlaces de navegación
const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} className="text-white hover:text-pink-400 transition duration-300 text-lg font-semibold">
    {children}
  </Link>
);