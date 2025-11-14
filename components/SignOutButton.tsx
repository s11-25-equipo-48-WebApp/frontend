'use client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Sesión cerrada correctamente');
      router.push('/');
      router.refresh();
    } catch (_error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-md bg-red-500 px-4 py-2 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
    >
      Cerrar Sesión
    </button>
  );
}
