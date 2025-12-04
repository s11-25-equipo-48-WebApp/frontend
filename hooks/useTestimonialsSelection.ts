import { useState } from 'react';
import { Testimonial } from '@/services/testimonial.service';

export const useTestimonialSelection = (testimonials: Testimonial[]) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(testimonials.map((t) => t.id));
      setSelectAll(true);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newIds = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];

      // Actualizar selectAll si todos están seleccionados
      setSelectAll(newIds.length === testimonials.length && testimonials.length > 0);

      return newIds;
    });
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setSelectAll(false);
  };

  return {
    selectedIds,
    selectAll,
    hasSelected: selectedIds.length > 0,
    toggleSelectAll,
    toggleSelect,
    clearSelection,
  };
};