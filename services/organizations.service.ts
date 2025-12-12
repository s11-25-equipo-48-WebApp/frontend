// services/organizations.service.ts
import api from "@/services/config";

export const organizationsService = {
  getPublic: async (page = 1, limit = 20) => {
    const response = await api.get('/organization/public', {
      params: { page, limit },
    });
    return response.data.data; 
  },
};
