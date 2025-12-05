'use client';

import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import ManagementCard from '@/components/dashboard/ManagementCard';

interface CategoryCardProps {
  onClose?: () => void;
  onConfirm?: (name: string) => void | Promise<void>;
  initialName?: string;
}

export default function CategoryCard({ onClose, onConfirm, initialName = '' }: CategoryCardProps) {
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (name.trim() !== '') {
        await onConfirm?.(name.trim());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    onClose?.();
  };

  return (
    <ManagementCard
      icon={(
        <div className="w-9 h-9 rounded bg-emerald-500 flex items-center justify-center text-white">
          <Tag size={16} />
        </div>
      )}
      title={initialName ? 'Editar categoría' : 'Agregar categoría'}
      description="Organiza tu contenido con categorías visibles para los administradores."
      onConfirm={handleConfirm}
      onReset={handleReset}
      confirmLabel={initialName ? 'Guardar' : 'Crear'}
      resetLabel="Cancelar"
      isLoading={isLoading}
    >
      <div>
        <input
          type="text"
          placeholder="Nombre de la categoría"
          className="w-full py-3 px-4 border border-gray-300 rounded-md outline-0 focus:border-foreground/50"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
    </ManagementCard>
  );
}
