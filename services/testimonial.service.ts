import api from '@/services/config';
import { transformAPIToTestimonial } from '@/utils/testimonial.utils';
import { mockTestimonialsData } from '@/data/mocks/mockTestimonialsData';

// Variable de entorno para activar/desactivar mocks
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export interface TestimonialAPIResponse {
  id: string;
  title: string;
  body: string;
  category_id: string;
  tags: string[];
  media_url: string;
  media_type: 'image' | 'video' | 'none';
  author: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client: string;
  course: string;
  received: string;
  editor: string;
  content: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const testimonialService = {
  getPending: async (
    organizationId: string,
    accessToken: string, 
    page: number = 1,
    limit: number = 50
  ): Promise<Testimonial[]> => {

    if (USE_MOCKS) {
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockTestimonialsData.map(transformAPIToTestimonial);
    }

    const response = await api.get<PaginatedResponse<TestimonialAPIResponse>>(
      `/organizations/${organizationId}/testimonios/pending`,
      {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      }
    );

    const apiTestimonials = response.data.data || [];
    return apiTestimonials.map(transformAPIToTestimonial);
  },

  getById: async (
    organizationId: string,
    id: string,
    accessToken: string 
  ): Promise<Testimonial> => {
    const response = await api.get<TestimonialAPIResponse>(
      `/organizations/${organizationId}/testimonios/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return transformAPIToTestimonial(response.data);
  },

  deleteMany: async (
    organizationId: string,
    ids: string[],
    accessToken: string 
  ): Promise<void> => {
    await Promise.all(
      ids.map((id) =>
        api.delete(`/organizations/${organizationId}/testimonios/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      )
    );
  },

  deleteOne: async (
    organizationId: string,
    id: string,
    accessToken: string // ✅ Agregado
  ): Promise<void> => {
    await api.delete(`/organizations/${organizationId}/testimonios/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  approve: async (
    organizationId: string,
    id: string,
    accessToken: string // ✅ Agregado
  ): Promise<Testimonial> => {
    const response = await api.patch<TestimonialAPIResponse>(
      `/organizations/${organizationId}/testimonios/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return transformAPIToTestimonial(response.data);
  },

  reject: async (
    organizationId: string,
    id: string,
    accessToken: string // ✅ Agregado
  ): Promise<Testimonial> => {
    const response = await api.patch<TestimonialAPIResponse>(
      `/organizations/${organizationId}/testimonios/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return transformAPIToTestimonial(response.data);
  },
};