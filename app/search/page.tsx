"use client";

import React, { useState } from "react";
import { usePublicOrganizations } from "@/hooks/usePublicOrganizations";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { organizations, meta, isLoading } = usePublicOrganizations();

  const filtered = organizations.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-winered text-xl">
        Cargando...
      </div>
    );
  }

  return (
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
            onClick={() => router.push(`/dashboard/testimonials/create?organizationId=${org.id}`)}
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
  );
}
