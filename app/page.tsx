'use client';
import UserInfo from '@/components/UserInfo';
import { useStore } from '@/store/zustand';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const organizations = [
  {
    id: 1,
    name: 'Organization 1',
    description: 'Description 1',
  },
  {
    id: 2,
    name: 'Organization 2',
    description: 'Description 2',
  },
];
export default function Home() {
  const { setCurrentOrganization } = useStore();
  const { data: session } = useSession();
  const toggleOrganization = (organizationId: string) => {
    setCurrentOrganization(organizationId);
    redirect('/dashboard');
  }
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
      {
        session?.user ? (
          <div className='p-2 space-y-2'>
            {organizations.map((organization) => (
              <div key={organization.id} className="flex items-center gap-4 cursor-pointer hover:bg-foreground/10" onClick={() => toggleOrganization(organization.id.toString())}>
                <div>
                  <h2 className="font-bold text-foreground">{organization.name}</h2>
                  <p className="text-foreground/60">{organization.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>landing page para usuario no logueado</div>
        )
      }

    </div>
  );
}
