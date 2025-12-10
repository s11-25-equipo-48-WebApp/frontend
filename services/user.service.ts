import api from "@/services/config";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  metadata?: {
    theme?: string;
    notifications?: boolean;
  };
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  metadata?: {
    theme?: string;
    notifications?: boolean;
  };
}

export const userService = {
  /**
   * Obtiene los datos del usuario autenticado
   */
  async getCurrentUser(): Promise<User> {
    const { data } = await api.get("/user/me");
    return data;
  },

  /**
   * Actualiza los datos del usuario autenticado
   */
  async updateUser(userData: UpdateUserData): Promise<User> {
    const { data } = await api.patch("/user/me", userData);
    return data;
  },
};