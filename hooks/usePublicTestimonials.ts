import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';
import { testimonialService } from '@/services/testimonial.service';
import { filterTestimonials, sortTestimonials, FilterType, SortType } from '@/utils/testimonial.utils';
import useRefreshAccessTokenClient from '@/hooks/useRefreshToken.client';

export const usePublicTestimonials = (
  filterBy: FilterType = '',
  sortBy: SortType = '',
  page: number = 1,
  limit: number = 50
) => {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();
  const refreshToken = useRefreshAccessTokenClient();

  const { data: rawTestimonials = [], isLoading, error } = useQuery({
    queryKey: ['testimonials', 'public', currentOrganization, page, limit],
    queryFn: async () => {
      // Intentar refrescar el token antes de hacer la petición
      const newToken = await refreshToken();
      const tokenToUse = newToken ?? (session?.user?.accessToken as string | undefined);
      
      return testimonialService.getPublic(
        currentOrganization!,
        tokenToUse!,
        page,
        limit
      );
    },
    enabled: !!currentOrganization && !!session?.user?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Filtrar solo testimonios aprobados 
  let processedTestimonials = rawTestimonials.filter(
    (t) => t.status === "aprobado"
  );

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