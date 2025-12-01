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
      name="sign out button"
      role="sign out button"
      onClick={handleSignOut}
      className="cursor-pointer px-7 py-2 bg-transparent border-2 border-red-500 text-red-500  rounded-full hover:bg-red-600 hover:text-white transition-colors font-medium"
    >
      Cerrar Sesión
    </button>
  );
}
