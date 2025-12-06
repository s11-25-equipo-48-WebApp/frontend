import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';
import { testimonialService } from '@/services/testimonial.service';

/**
 * Hook específico para el widget de testimonios pendientes en el dashboard
 * Obtiene un número limitado de testimonios pendientes (por defecto 4)
 */
export const usePendingTestimonialsWidget = (limit: number = 4) => {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();

  const { data: testimonials = [], isLoading, error } = useQuery({
    queryKey: ['testimonials', 'pending-widget', currentOrganization, limit],
    queryFn: async () => {
      const allPending = await testimonialService.getPending(
        currentOrganization!,
        session?.user?.accessToken!,
        1,
        limit
      );
      return allPending;
    },
    enabled: !!currentOrganization && !!session?.user?.accessToken,
    staleTime: 2 * 60 * 1000, // 2 minutos - más corto para el widget
    refetchInterval: 5 * 60 * 1000, // Refresca cada 5 minutos automáticamente
  });

  return {
    testimonials,
    count: testimonials.length,
    isLoading,
    error,
    hasOrganization: !!currentOrganization,
  };
};