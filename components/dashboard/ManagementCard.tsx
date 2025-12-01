"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import  Button  from "@/components/Button";

interface ManagementCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode; // Espacio para los inputs
  onClose?: () => void;
  onConfirm?: () => void;
  onReset?: () => void;
  confirmLabel?: string;
  resetLabel?: string;
  isLoading?: boolean;
}

export function ManagementCard({
  icon,
  title,
  description,
  children,
  onClose,
  onConfirm,
  onReset,
  confirmLabel = "Confirmar",
  resetLabel = "Cancelar",
  isLoading = false,
}: ManagementCardProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-card border border-border rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="text-foreground">{icon}</div>
          <span className="text-sm font-medium text-foreground" />
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {/* Título y descripción */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Espacio para inputs dinámicos */}
        <div className="space-y-4">{children}</div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-6 py-4 border-t border-border bg-card">
        <Button
          variant="wineAlt"
          onClick={onReset}
          disabled={isLoading}
        >
          {resetLabel}
        </Button>
        <Button
          variant="wine"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
