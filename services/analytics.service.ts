import api from '@/services/config';

// Variable de entorno para activar/desactivar mocks
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export interface AnalyticsMetricsResponse {
  testimonios_publicados: number;
  testimonios_recibidos: number;
  tasa_aprobacion: number;
  tasa_consentimiento: number;
  visualizaciones: number;
}

export interface DashboardMetrics {
  publishedMonth: number;
  receivedMonth: number;
  approvalRate: number;
  consentRate: number;
  views: number;
}

// Mock data para desarrollo
const mockMetrics: DashboardMetrics = {
  publishedMonth: 90,
  receivedMonth: 128,
  approvalRate: 89,
  consentRate: 92,
  views: 234,
};

/**
 * Transforma la respuesta de la API al formato usado en el frontend
 */
const transformAPIToMetrics = (apiData: AnalyticsMetricsResponse): DashboardMetrics => {
  return {
    publishedMonth: apiData.testimonios_publicados,
    receivedMonth: apiData.testimonios_recibidos,
    approvalRate: apiData.tasa_aprobacion,
    consentRate: apiData.tasa_consentimiento,
    views: apiData.visualizaciones,
  };
};

export const analyticsService = {
  /**
   * Obtiene las métricas del dashboard para una organización
   * @param organizationId - ID de la organización (UUID)
   * @param accessToken - Token de acceso del usuario
   * @param startDate - Fecha de inicio opcional (ISO 8601)
   * @param endDate - Fecha de fin opcional (ISO 8601)
   */
  getMetrics: async (
    organizationId: string,
    accessToken: string,
    startDate?: string,
    endDate?: string
  ): Promise<DashboardMetrics> => {
    if (USE_MOCKS) {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockMetrics;
    }

    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await api.get<AnalyticsMetricsResponse>(
      `/api/v1/organizations/${organizationId}/analytics/metrics`,
      {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return transformAPIToMetrics(response.data);
  },

  /**
   * Obtiene las métricas del mes actual
   */
  getCurrentMonthMetrics: async (
    organizationId: string,
    accessToken: string
  ): Promise<DashboardMetrics> => {
    // Calcular el primer día del mes actual
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endDate = now.toISOString();

    return analyticsService.getMetrics(organizationId, accessToken, startDate, endDate);
  },
};