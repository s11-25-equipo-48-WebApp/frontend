import { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { testimonialQueries, mockTestimonials, Testimonial } from '@/services/dashboard.service';
import { filterTestimonials, sortTestimonials, FilterType, SortType } from '@/utils/testimonial.utils';

export const useTestimonials = (filterBy: FilterType, sortBy: SortType) => {
  // Query para obtener testimonios
  const { data: rawTestimonials = [], isLoading, refetch } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: testimonialQueries.pending,
    initialData: mockTestimonials,
  });

  // Filtrado y ordenamiento
  const testimonials = useMemo(() => {
    const filtered = filterTestimonials(rawTestimonials, filterBy);
    return sortTestimonials(filtered, sortBy);
  }, [rawTestimonials, filterBy, sortBy]);

  // Mutation para eliminar
  const deleteTestimonials = useMutation({
    mutationFn: testimonialQueries.deleteMany,
    onSuccess: () => {
      toast.success('Testimonios eliminados exitosamente');
      refetch();
    },
    onError: (error: any) => {
      toast.error('Error al eliminar los testimonios. ' + (error.response?.data?.message || ''));
    }
  });

  return {
    testimonials,
    rawTestimonials,
    isLoading,
    deleteTestimonials,
    refetch,
  };
};

export const useTestimonialSelection = (testimonials: Testimonial[]) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedIds(newSelectAll ? testimonials.map(t => t.id) : []);
  };

  const toggleSelect = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    
    setSelectedIds(newSelectedIds);
    setSelectAll(newSelectedIds.length === testimonials.length);
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