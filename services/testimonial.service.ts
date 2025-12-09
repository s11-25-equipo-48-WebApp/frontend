import api from "@/services/config";
import { transformAPIToTestimonial } from "@/utils/testimonial.utils";
import { mockTestimonialsData } from "@/data/mocks/mockTestimonialsData";

// Variable de entorno para activar/desactivar mocks
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export interface TestimonialAPIResponse {
  id: string;
  title: string;
  body: string;
  category_id: string;
  tags: string[];
  media_url: string;
  media_type: "image" | "video" | "none";
  author: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  title: string;
  body: string;
  category_id: string;
  tags?: string[];
  media_url?: string;
  media_type?: "image" | "video" | "none";
  author_name?: string;
  email?: string;
  status?: "pending" | "approved" | "rejected";
  created_at?: string;
  updated_at?: string;
  // Campos legacy para compatibilidad
  client?: string;
  course?: string;
  received?: string;
  editor?: string;
  content?: string;
  image?: string;
  author?: string;
  role?: string;
  createdAt?: string;
}

export interface CreateTestimonioDto {
  title: string;
  body: string;
  category_id: string;
  email: string;
  author_name?: string;
  tags?: string[];
  media_url?: string;
  media_type?: "image" | "video" | "none";
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const testimonialService = {
  create: async (
    organizationId: string,
    data: CreateTestimonioDto,
    accessToken: string,
    isAdmin: boolean = false
  ): Promise<Testimonial> => {
    const payload = {
      ...data,
      // Si es admin, el estado es aprobado automáticamente
      ...(isAdmin && { status: "approved" }),
    };

    const response = await api.post<TestimonialAPIResponse>(
      `/organizations/${organizationId}/testimonios`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return transformAPIToTestimonial(response.data);
  },

  getPending: async (
    organizationId: string,
    accessToken: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Testimonial[]> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500));
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

  // ✅ NUEVO: Obtener testimonios públicos/publicados
  getPublic: async (
    organizationId: string,
    accessToken: string,
    page: number = 1,
    limit: number = 50,
    categoryId?: string,
    tagId?: string
  ): Promise<Testimonial[]> => {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Filtrar solo los aprobados para simular testimonios públicos
      return mockTestimonialsData
        .filter((t) => t.status === "approved")
        .map(transformAPIToTestimonial);
    }

    const params: any = { page, limit };
    if (categoryId) params.category_id = categoryId;
    if (tagId) params.tag_id = tagId;

    const response = await api.get<PaginatedResponse<TestimonialAPIResponse>>(
      `/api/v1/organizations/${organizationId}/testimonios/public`,
      {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const apiTestimonials = response.data.data || [];
    return apiTestimonials.map(transformAPIToTestimonial);
  },

  // ✅ NUEVO: Obtener testimonios recientes (últimos publicados)
  getRecent: async (
    organizationId: string,
    accessToken: string,
    limit: number = 5
  ): Promise<Testimonial[]> => {
    // Obtener testimonios públicos y tomar solo los más recientes
    const allPublic = await testimonialService.getPublic(
      organizationId,
      accessToken,
      1,
      limit
    );

    // Ordenar por fecha más reciente primero
    return allPublic
      .sort((a, b) => {
        const dateA = new Date(a.received.split("/").reverse().join("-"));
        const dateB = new Date(b.received.split("/").reverse().join("-"));
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
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
    accessToken: string
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
    accessToken: string
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
    accessToken: string
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
