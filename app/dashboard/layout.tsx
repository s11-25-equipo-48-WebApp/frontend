import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/Topbar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen ">
      {/* 1. Barra Superior (Header) */}
      <TopBar user={session.user} />

      {/* 2. Contenedor Principal con Flex */}
      <div className="flex p-4 md:p-6 gap-8 max-w-[1600px] mx-auto">
        {/* Sidebar: Ahora es un bloque estático, no fixed */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}