import { auth } from '@/lib/auth';
import SignOutButton from '@/components/SignOutButton';
import Link from 'next/link';
export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <SignOutButton />
          </div>
          <Link href="/dashboard/editors">gestionar editores</Link>
          <Link href="/dashboard/pending-reviews">gestionar reseñas</Link>

          <div className="flex items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {/* ¡Bienvenido, {session?.user?.firstName}! */}
              </h2>
              <p className="text-foreground/60">{session?.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background rounded-lg p-6 border border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-2">Sesión Activa</h3>
              <p className="text-foreground/60">Tu sesión está protegida con NextAuth</p>
            </div>
            <div className="bg-background rounded-lg p-6 border border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-2">Usuario</h3>
              <p className="text-foreground/60">ID: {session?.user?.id || 'N/A'}</p>
            </div>
            <div className="bg-background rounded-lg p-6 border border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-2">Estado</h3>
              <p className="text-foreground/60">Autenticado ✓</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-btn-primary/10 rounded-lg border border-btn-primary/20">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              🎉 NextAuth configurado exitosamente
            </h3>
            <p className="text-foreground/80">
              Ahora puedes proteger rutas, usar sesiones y autenticar usuarios en tu aplicación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
