"use client";

import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import ManagementCard from "@/components/dashboard/ManagementCard";

interface CategoryCardProps {
  onClose?: () => void;
  // allow any promise return (e.g. createCategory returns the created object)
  onConfirm?: (name: string) => void | Promise<unknown>;
  initialName?: string;
  onError?: (message: string) => void;
}

export default function CategoryCard({
  onClose,
  onConfirm,
  initialName = "",
  onError,
}: CategoryCardProps) {
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleConfirm = async () => {
    if (name.trim().length > 40) {
      onError?.("El nombre de la categoría no puede exceder 40 caracteres");
      return;
    }
    setIsLoading(true);
    try {
      if (name.trim() !== "") {
        await onConfirm?.(name.trim());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    onClose?.();
  };

  return (
    <ManagementCard
      icon={
        <div className="bg-[#BCDBB8] text-white shadow-xl rounded-lg p-3">
          <Tag size={24} />
        </div>
      }
      title={initialName ? "Editar categoría" : "Agregar categoría"}
      description="Organiza tu contenido con categorías visibles para los administradores."
      onConfirm={handleConfirm}
      onReset={handleReset}
      confirmLabel={initialName ? "Guardar" : "Crear"}
      resetLabel="Cancelar"
      isLoading={isLoading}
    >
      <div>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md outline-0 focus:border-foreground/50"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
    </ManagementCard>
  );
}
