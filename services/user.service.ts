import api from "@/services/config";

export interface User {
  id: string;
  email: string;
  name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deactivated_at: string | null;
  profile: {
    user_id: string;
    avatar_url: string;
    bio: string;
    metadata: Record<string, any>;
  } | null;
}

export interface UpdateUserData {
  name?: string;
  last_name?: string;
  email?: string;
  profile?: {
    avatar_url?: string;
    bio?: string;
    metadata?: Record<string, any>;
  };
}

interface UserApiResponse {
  success: boolean;
  data: User;
}

export const userService = {
  /**
   * Obtiene los datos del usuario actual
   */
  async getCurrentUser(accessToken: string): Promise<User> {
    try {
      const { data } = await api.get<UserApiResponse>("/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return data.data;
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      throw error;
    }
  },

  async updateUser(
    userData: UpdateUserData,
    accessToken: string
  ): Promise<User> {
    // Transformar los datos al formato que espera la API
    const requestBody: any = {};

    if (userData.name !== undefined) {
      requestBody.name = userData.name;
    }

    if (userData.last_name !== undefined) {
      requestBody.last_name = userData.last_name;
    }

    if (userData.email !== undefined) {
      requestBody.email = userData.email;
    }

    // Si se envía profile, extraer avatar_url directamente
    if (userData.profile?.avatar_url !== undefined) {
      requestBody.avatar_url = userData.profile.avatar_url;
    }

    if (userData.profile?.bio !== undefined) {
      requestBody.bio = userData.profile.bio;
    }

    const { data } = await api.patch<UserApiResponse>("/user/me", requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return data.data;
  },
};
