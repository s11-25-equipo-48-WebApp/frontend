'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function TokenSync() {
  const { update } = useSession();

  useEffect(() => {
    const handler = (e: Event) => {
      update({ user: { accessToken: (e as CustomEvent).detail } });
    };
    window.addEventListener('tokenRefreshed', handler as EventListener);
    return () => window.removeEventListener('tokenRefreshed', handler as EventListener);
  }, [update]);

  return null;
}
