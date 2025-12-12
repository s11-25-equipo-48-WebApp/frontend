"use client";

import React, { useState } from "react";
import { usePublicOrganizations } from "@/hooks/usePublicOrganizations";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/zustand";
import { useSession } from "next-auth/react";
import UserInfo from "@/components/UserInfo";
export default function Page() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { setCurrentOrganization, setRole } = useStore();
  const { data: session } = useSession();
  const { organizations, meta, isLoading } = usePublicOrganizations();

  const filtered = organizations.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 h-dvh">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winered"></div>
      </div>
    );
  }

  const sendTestimonial = ({ id, admin }: { id: string; admin: string }) => {
    setCurrentOrganization(id);
    setRole(admin === session?.user?.id ? "admin" : "editor");
    router.push("/dashboard/testimonials/create");
  };

  return (
    <div>
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="text-2xl font-bold text-winered dark:text-yellow cursor-pointer"
                onClick={() => router.push("/")}
              >
                Sayso
              </div>
            </div>
            <div className="flex items-center gap-4">
              <UserInfo />
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-[#DBD1D5] border-4 border-white rounded-3xl shadow-2xl p-6">
          <h1 className="text-3xl font-bold text-winered text-center mb-4">
            Busqueda
          </h1>

          <input
            type="text"
            placeholder="Buscar organización por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-[#DBD1D5] border-4 border-white rounded-lg text-foreground placeholder:text-foreground/60 focus:outline-none focus:border-winered/30 transition-colors"
          />
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-center text-foreground/50 text-lg">
              No se encontraron resultados.
            </p>
          )}

          {filtered.map((org) => (
            <div
              key={org.id}
              onClick={() =>
                sendTestimonial({ id: org.id, admin: org.adminId })
              }
              className="
              bg-[#DBD1D5]
              border-4 border-white
              rounded-3xl
              shadow-xl
              p-6
              transition-all
              cursor-pointer

              hover:shadow-2xl
              hover:scale-105
              hover:border-winered
            "
            >
              <h2 className="text-2xl font-semibold text-winered">
                {org.name}
              </h2>
              <p className="mt-2 text-foreground text-md">{org.description}</p>
            </div>
          ))}
        </div>

        {meta && (
          <p className="text-center text-sm text-foreground/60 mt-4">
            Página <span className="font-bold">{meta.page}</span> de{" "}
            <span className="font-bold">{meta.totalPages}</span>
          </p>
        )}
      </div>
    </div>
  );
}
