import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';
import { testimonialService } from '@/services/testimonial.service';

export const useRecentTestimonials = (limit: number = 5) => {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();

  const { data: testimonials = [], isLoading, error } = useQuery({
    queryKey: ['testimonials', 'recent', currentOrganization, limit],
    queryFn: () =>
      testimonialService.getRecent(
        currentOrganization!,
        session?.user?.accessToken!,
        limit
      ),
    enabled: !!currentOrganization && !!session?.user?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    testimonials,
    isLoading,
    error,
    hasOrganization: !!currentOrganization,
  };
};