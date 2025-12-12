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

  // Campos adicionales (aliases / datos crudos de la API)
  media_url?: string | null;
  media_type?: "image" | "video" | "none";
  image?: string | null;
  email?: string | null;
  category_id?: string | null;
  created_at?: string | null;
  received?: string | null;
  author?: string | null;
  body?: string;
  status?: "pendiente" | "aprobado" | "rechazado";
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

/**
 * Normaliza posibles valores de status (inglés/español) a los valores esperados en la UI (español).
 */
function normalizeStatus(
  status?: string | null
): "pendiente" | "aprobado" | "rechazado" | undefined {
  if (!status) return undefined;
  const s = String(status).trim().toLowerCase();
  if (s === "approved" || s === "aprobado") return "aprobado";
  if (s === "rejected" || s === "rechazado") return "rechazado";
  if (s === "pending" || s === "pendiente") return "pendiente";
  return undefined;
}

export const testimonialService = {
  /**
   * Obtiene todos los testimonios de una organización (sin filtro de estado)
   */
  getAll: async (
    organizationId: string,
    accessToken: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Testimonial[]> => {
    const response = await api.get<
      APIResponse<PaginatedResponse<TestimonialAPIResponse>>
    >(`/organizations/${organizationId}/testimonios`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const apiTestimonials = response.data.data.data || [];
    return apiTestimonials
      .map(transformAPIToTestimonial)
      .map((t) => ({ ...t, status: normalizeStatus(t.status) || "pendiente" }));
  },

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

    const apiTestimonials = response.data.data.data || [];
    return apiTestimonials
      .map(transformAPIToTestimonial)
      .map((t) => ({ ...t, status: normalizeStatus(t.status) || "pendiente" }));
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
    return apiTestimonials
      .map(transformAPIToTestimonial)
      .map((t) => ({ ...t, status: normalizeStatus(t.status) || "pendiente" }));
  },

  getRecent: async (
    organizationId: string,
    accessToken: string,
    limit: number = 5
  ): Promise<Testimonial[]> => {
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

    const t = transformAPIToTestimonial(response.data.data);
    return { ...t, status: normalizeStatus(t.status) || "pendiente" };
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

  /*Obtiene los testimonios pendientes del usuario autenticado (para editores) */
  getPendingForUser: async (
    accessToken: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Testimonial[]> => {
    const response = await api.get<
      APIResponse<PaginatedResponse<TestimonialAPIResponse>>
    >(`/user/me/testimonios/pending`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const apiTestimonials = response.data.data.data || [];
    return apiTestimonials
      .map(transformAPIToTestimonial)
      .map((t) => ({ ...t, status: normalizeStatus(t.status) || "pendiente" }));
  },

  /*Elimina un testimonio del usuario autenticado (para editores)*/
  deleteForUser: async (id: string, accessToken: string): Promise<void> => {
    await api.delete(`/user/me/testimonios/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  updateStatus: async (
    organizationId: string,
    id: string,
    accessToken: string,
    status: "aprobado" | "rechazado" | "pendiente"
  ): Promise<Testimonial> => {
    const response = await api.patch<APIResponse<TestimonialAPIResponse>>(
      `/organizations/${organizationId}/testimonios/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const t = transformAPIToTestimonial(response.data.data);
    return { ...t, status: normalizeStatus(t.status) || "pendiente" };
  },

  update: async (
    organizationId: string,
    id: string,
    accessToken: string,
    payload: Partial<{ title: string; body: string; category_id: string }>
  ): Promise<Testimonial> => {
    const response = await api.patch<APIResponse<TestimonialAPIResponse>>(
      `/organizations/${organizationId}/testimonios/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const t = transformAPIToTestimonial(response.data.data);
    return { ...t, status: normalizeStatus(t.status) || "pendiente" };
  },
};
