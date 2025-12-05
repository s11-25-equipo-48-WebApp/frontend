'use client';
import Home from '@/components/Home';
import LandingPage from '@/components/LandingPage';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-20 min-h-dvh">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winered"></div>
      </div>
    );
  }
  if (session?.user) {
    return <Home />;
  }
  else {
    return <LandingPage />;
  }
}
