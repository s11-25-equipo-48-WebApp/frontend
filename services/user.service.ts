import api from "@/services/config";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  last_name?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deactivated_at?: string | null;
  profile?: {
    user_id?: string;
    avatar_url?: string;
    bio?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  last_name?: string;
  profile?: {
    avatar_url?: string;
    bio?: string;
    metadata?: Record<string, unknown>;
  };
}

// Interfaz para la respuesta del backend
interface UserApiResponse {
  success: boolean;
  data: User;
}

export const userService = {
  /**
   * Obtiene los datos del usuario autenticado
   */
  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await api.get<UserApiResponse>("/user/me");
      
      console.log('getCurrentUser response:', data);
      
      return data.data;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      throw error;
    }
  },

  /**
   * Actualiza los datos del usuario autenticado
   */
  async updateUser(userData: UpdateUserData): Promise<User> {
    try {
      console.log('Updating user with data:', userData);
      
      const { data } = await api.patch<UserApiResponse>("/user/me", userData);
      
      console.log('updateUser response:', data);
      
      return data.data;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },
};