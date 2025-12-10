import api from "@/services/config";

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

interface APIResponse<T> {
  success: boolean;
  data: T;
}

const transformAPIToMetrics = (
  apiData: AnalyticsMetricsResponse
): DashboardMetrics => {
  const transformed = {
    publishedMonth: apiData.testimonios_publicados,
    receivedMonth: apiData.testimonios_recibidos,
    approvalRate: apiData.tasa_aprobacion,
    consentRate: apiData.tasa_consentimiento,
    views: apiData.visualizaciones,
  };
  return transformed;
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
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await api.get<APIResponse<AnalyticsMetricsResponse>>(
      `/organizations/${organizationId}/analytics/metrics`,
      {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const apiMetrics = response.data.data;
    return transformAPIToMetrics(apiMetrics);
  },

  /**
   * Obtiene las métricas del mes actual
   */
  getCurrentMonthMetrics: async (
    organizationId: string,
    accessToken: string
  ): Promise<DashboardMetrics> => {
    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();
    const endDate = now.toISOString();

    return analyticsService.getMetrics(
      organizationId,
      accessToken,
      startDate,
      endDate
    );
  },
};
