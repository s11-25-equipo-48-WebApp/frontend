'use client';
import TokenSync from '@/components/TokenSync';
import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }: { children: React.ReactNode; }) {
  return <SessionProvider>
    <TokenSync />
    {children}
  </SessionProvider>;
}
