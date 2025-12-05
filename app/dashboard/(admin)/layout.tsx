"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/zustand";
import useRefreshAccessTokenClient from "@/hooks/useRefreshToken.client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const refreshAccessToken = useRefreshAccessTokenClient();
  const router = useRouter();
  const currentOrganization = useStore((s) => s.currentOrganization);
  const setCurrentOrganization = useStore((s) => s.setCurrentOrganization);
  const [checking, setChecking] = useState(true);
  const [triedRefresh, setTriedRefresh] = useState(false);

  useEffect(() => {
    // Esperar a que session esté listo
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Obtener rol para la organización seleccionada
    const organizations = (session.user as any)?.organizations as
      | Array<any>
      | undefined;
    let isAdminForOrg = false;

    if (organizations && currentOrganization) {
      const org = organizations.find((o) => o.id === currentOrganization);
      if (org && org.role === "admin") isAdminForOrg = true;
    }

    // Si no hay organización seleccionada, intentar seleccionar una admin si existe
    if (!currentOrganization && organizations && organizations.length > 0) {
      const adminOrg = organizations.find((o) => o.role === "admin");
      if (adminOrg) {
        setCurrentOrganization(adminOrg.id);
        isAdminForOrg = true;
      }
    }

    // Si no hay organizaciones en la sesión, intentar refresh una vez antes de bloquear
    const orgsEmpty = !organizations || organizations.length === 0;
    if (orgsEmpty && !triedRefresh) {
      setTriedRefresh(true);
      (async () => {
        try {
          await refreshAccessToken();
          // La llamada a `refreshAccessToken` intentará actualizar la sesión
          // Si la sesión se actualiza con organizations, el efecto se volverá a ejecutar
        } catch (e) {
          // ignore
        }
      })();
      return;
    }

    // Fallback: si el usuario no es admin en la organización seleccionada, bloquear
    if (!isAdminForOrg) {
      console.error(
        "Unauthorized access attempt for organization:",
        currentOrganization,
        {
          userId: session.user?.id,
          organizations: organizations?.map((o) => ({
            id: o.id,
            role: o.role,
          })),
        }
      );
      router.push("/dashboard?error=unauthorized");
      return;
    }

    setChecking(false);
  }, [status, session, currentOrganization, router, setCurrentOrganization]);

  if (checking) return null; // o un loader pequeño

  return <>{children}</>;
}
