import api from "@/services/config";
import { transformAPIToTestimonial } from "@/utils/testimonial.utils";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface TestimonialAPIResponse {
  id: string;
  title: string;
  body: string;
  category: {
    id: string;
    name: string;
    createdAt: string;
  } | null;
  tags: Tag[];
  media_url: string | null;
  media_type: "image" | "video" | "none";
  author_name: string;
  author_email: string;
  created_by_user_id: string | null;
  created_by_user: {
    id: string;
    email: string;
    name: string;
    last_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deactivated_at: string | null;
    password_hash?: string;
  } | null;
  approved_by: string | null;
  approved_at: string | null;
  status: "pendiente" | "aprobado" | "rechazado";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Testimonial {
  id: string;
  author_name: string;
  title: string;
  categoryName: string;
  categoryId?: string;
  mediaType: "image" | "video" | "none";
  content: string;
  createdAt: string;
  formattedDate: string;
  course?: string;
  editor: string;
}

interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
}

export const testimonialService = {
  getPending: async (
    organizationId: string,
    accessToken: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Testimonial[]> => {
    const response = await api.get<
      APIResponse<PaginatedResponse<TestimonialAPIResponse>>
    >(`/organizations/${organizationId}/testimonios/pending`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Acceso correcto a los datos: response.data.data.data
    const apiTestimonials = response.data.data.data || [];
    return apiTestimonials.map(transformAPIToTestimonial);
  },

  getPublic: async (
    organizationId: string,
    accessToken: string,
    page: number = 1,
    limit: number = 50,
    categoryId?: string,
    tagId?: string
  ): Promise<Testimonial[]> => {
    const params: any = { page, limit };
    if (categoryId) params.category_id = categoryId;
    if (tagId) params.tag_id = tagId;

    const response = await api.get<
      APIResponse<PaginatedResponse<TestimonialAPIResponse>>
    >(`/organizations/${organizationId}/testimonios/public`, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const apiTestimonials = response.data.data.data || [];
    return apiTestimonials.map(transformAPIToTestimonial);
  },

  getRecent: async (
    organizationId: string,
    accessToken: string,
    limit: number = 5
  ): Promise<Testimonial[]> => {
    // Usar directamente getPublic con el límite especificado
    const testimonials = await testimonialService.getPublic(
      organizationId,
      accessToken,
      1,
      limit
    );

    return testimonials;
  },

  getById: async (
    organizationId: string,
    id: string,
    accessToken: string
  ): Promise<Testimonial> => {
    const response = await api.get<APIResponse<TestimonialAPIResponse>>(
      `/organizations/${organizationId}/testimonios/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return transformAPIToTestimonial(response.data.data);
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
    const response = await api.patch<APIResponse<TestimonialAPIResponse>>(
      `/organizations/${organizationId}/testimonios/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return transformAPIToTestimonial(response.data.data);
  },

  reject: async (
    organizationId: string,
    id: string,
    accessToken: string
  ): Promise<Testimonial> => {
    const response = await api.patch<APIResponse<TestimonialAPIResponse>>(
      `/organizations/${organizationId}/testimonios/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return transformAPIToTestimonial(response.data.data);
  },
};
