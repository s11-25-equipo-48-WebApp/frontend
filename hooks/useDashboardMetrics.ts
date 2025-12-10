import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';
import { analyticsService } from '@/services/analytics.service';

/**
 * Hook para obtener las métricas del dashboard
 * Por defecto obtiene las métricas del mes actual
 */
export const useDashboardMetrics = (
  startDate?: string,
  endDate?: string
) => {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();

  const { data: metrics, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-metrics', currentOrganization, startDate, endDate],
    queryFn: async () => {
      
      if (!startDate && !endDate) {
        // Si no se proporcionan fechas, obtener métricas del mes actual
        return analyticsService.getCurrentMonthMetrics(
          currentOrganization!,
          session?.user?.accessToken!
        );
      }
        
      
      return analyticsService.getMetrics(
        currentOrganization!,
        session?.user?.accessToken!,
        startDate,
        endDate
      );
    },
    enabled: !!currentOrganization && !!session?.user?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 10 * 60 * 1000, // Refresca cada 10 minutos
  });

  return {
    metrics,
    isLoading,
    error,
    refetch,
    hasOrganization: !!currentOrganization,
  };
};