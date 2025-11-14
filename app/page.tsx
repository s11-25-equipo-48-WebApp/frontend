'use client';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import UserInfo from '@/components/UserInfo';

export default function Home() {
  const { setTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <nav className="border-b border-foreground/10 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-foreground">Mi App</h1>
            </div>
            <div className="flex items-center gap-4">
              <UserInfo />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-8">
          {/* Theme Toggle */}
          <div className="flex justify-center gap-4">
            <button
              className="rounded-md bg-btn-primary px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
              onClick={() => setTheme('light')}
            >
              Tema Claro
            </button>
            <button
              className="rounded-md bg-btn-primary px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
              onClick={() => setTheme('dark')}
            >
              Tema Oscuro
            </button>
            <button
              className="rounded-md bg-btn-primary px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
              onClick={() => setTheme('system')}
            >
              Sistema
            </button>
          </div>

          {/* Content Card */}
          <div className="rounded-lg bg-card p-8 shadow-lg">
            <div className="flex flex-col items-center gap-6 text-center">
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={37}
                priority
              />

              <h1 className="text-4xl font-bold text-foreground">
                ¡Bienvenido a tu App!
              </h1>

              <p className="max-w-2xl text-lg text-foreground/80">
                Proyecto configurado con Next.js 16, Tailwind CSS v4, NextAuth v5,
                React Query, Zustand y más.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
                <div className="rounded-lg bg-background p-4 border border-foreground/10">
                  <h3 className="font-semibold text-foreground mb-2">🎨 Temas</h3>
                  <p className="text-sm text-foreground/60">
                    Cambia entre modo claro y oscuro
                  </p>
                </div>
                <div className="rounded-lg bg-background p-4 border border-foreground/10">
                  <h3 className="font-semibold text-foreground mb-2">🔐 Auth</h3>
                  <p className="text-sm text-foreground/60">
                    Autenticación con NextAuth v5
                  </p>
                </div>
                <div className="rounded-lg bg-background p-4 border border-foreground/10">
                  <h3 className="font-semibold text-foreground mb-2">⚡ Moderno</h3>
                  <p className="text-sm text-foreground/60">
                    Stack tecnológico actualizado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
