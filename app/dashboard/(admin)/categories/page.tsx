"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import ManagementCard from "@/components/dashboard/ManagementCard";

interface AddCategoryProps {
  onClose?: () => void;
  onConfirm?: (categoryName: string) => void | Promise<void>;
}
export default function AddCategory({ onClose, onConfirm }: AddCategoryProps) {
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (categoryName.trim() !== "") {
        await onConfirm?.(categoryName);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCategoryName("");
  };

  return (
    <ManagementCard
      icon={<Tag size={24} />}
      title="Agregar Categorías a tu Proyecto"
      description="Las categorías ayudan a organizar tu contenido y facilitan la búsqueda."
      onConfirm={handleConfirm}
      onReset={handleReset}
      confirmLabel="Confirmar"
      resetLabel="Cancelar"
      isLoading={isLoading}
    >
      {/* Input de categoría */}
      <input
        type="text"
        placeholder="Nombre de la categoría"
        className="w-full py-3 px-4 border border-gray-300 rounded-md outline-0 focus:border-foreground/50"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        disabled={isLoading}
      />
    </ManagementCard>
  );
}
