'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Credenciales inválidas');
      } else {
        toast.success('Inicio de sesión exitoso');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (_error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-foreground/60">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-btn-primary focus:outline-none focus:ring-1 focus:ring-btn-primary"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-btn-primary focus:outline-none focus:ring-1 focus:ring-btn-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-btn-primary px-4 py-2 text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-btn-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="mt-4 p-4 bg-background rounded-md border border-foreground/10">
            <p className="text-xs text-foreground/60 text-center">
              <strong>Demo:</strong> email: demo@example.com | password: demo123
            </p>
          </div>
        </form>

        {/* Opciones para OAuth (descomentadas cuando tengas las credenciales) */}
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-foreground/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-foreground/60">O continúa con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
              className="flex justify-center items-center rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-btn-primary"
            >
              GitHub
            </button>
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="flex justify-center items-center rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-btn-primary"
            >
              Google
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
