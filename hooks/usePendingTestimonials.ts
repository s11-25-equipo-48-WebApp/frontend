import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';
import { testimonialService } from '@/services/testimonial.service';
import { filterTestimonials, sortTestimonials, FilterType, SortType } from '@/utils/testimonial.utils';

export const usePendingTestimonials = (
  filterBy: FilterType = '',
  sortBy: SortType = '',
  page: number = 1,
  limit: number = 50
) => {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();

  const { data: rawTestimonials = [], isLoading, error } = useQuery({
    queryKey: ['testimonials', 'pending', currentOrganization, page, limit],
    queryFn: () =>
      testimonialService.getPending(
        currentOrganization!,
        session?.user?.accessToken!,
        page,
        limit
      ),
    enabled: !!currentOrganization && !!session?.user?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Aplicar filtros y ordenamiento en el cliente
  let processedTestimonials = [...rawTestimonials];

  if (filterBy) {
    processedTestimonials = filterTestimonials(processedTestimonials, filterBy);
  }

  if (sortBy) {
    processedTestimonials = sortTestimonials(processedTestimonials, sortBy);
  }

  return {
    testimonials: processedTestimonials,
    rawTestimonials,
    isLoading,
    error,
    hasOrganization: !!currentOrganization,
  };
};