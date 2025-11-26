"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-foreground">Cargando...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <Link
        href="/auth/login"
        className="rounded-md bg-btn-primary px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
      >
        Iniciar Sesión
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-foreground">Hola, {session?.user?.name}</span>
      <Link
        href="/dashboard"
        className="rounded-md bg-btn-primary px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
      >
        Dashboard
      </Link>
    </div>
  );
}
