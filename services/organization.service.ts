import api from "@/services/config";

export interface OrganizationAPIResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
}

export const organizationService = {
  getById: async (
    organizationId: string,
    accessToken: string
  ): Promise<OrganizationAPIResponse> => {
    const response = await api.get<APIResponse<OrganizationAPIResponse>>(
      `/organization/${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.data;
  },
};