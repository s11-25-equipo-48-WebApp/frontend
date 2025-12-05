"use client";

import type { ReactNode } from "react";
import Button from "@/components/Button";

interface ManagementCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode; // Espacio para los inputs
  onConfirm?: () => void;
  onReset?: () => void;
  confirmLabel?: string;
  resetLabel?: string;
  isLoading?: boolean;
}

export default function ManagementCard({
  icon,
  title,
  description,
  children,
  onConfirm,
  onReset,
  confirmLabel = "Confirmar",
  resetLabel = "Cancelar",
  isLoading = false,
}: ManagementCardProps) {
  return (
    <div className="w-full max-w-xl my-12 mx-auto py-8 bg-[#DBD1D5] border-5 border-white rounded-lg shadow-xl p-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 ">
        <div className="flex items-center gap-3">{icon}</div>
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-md text-gray-600">{description}</p>
        </div>

        {/* Espacio para inputs dinámicos */}
        <div className="space-y-4">{children}</div>
      </div>

      <div className="flex gap-3 px-6 py-4 ">
        <Button variant="wineAlt" onClick={onReset} disabled={isLoading}>
          {resetLabel}
        </Button>
        <Button variant="wine" onClick={onConfirm} disabled={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
