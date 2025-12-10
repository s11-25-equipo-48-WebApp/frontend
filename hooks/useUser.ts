import { useState } from "react";
import { toast } from "react-toastify";
import { userService, UpdateUserData, User } from "@/services/user.service";

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUser = async (): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await userService.getCurrentUser();
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener usuario";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: UpdateUserData): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    
    const loadingToast = toast.loading("Actualizando perfil...");
    
    try {
      const updatedUser = await userService.updateUser(userData);
      
      toast.update(loadingToast, {
        render: "¡Perfil actualizado exitosamente!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar usuario";
      setError(errorMessage);
      
      toast.update(loadingToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getCurrentUser,
    updateUser,
    isLoading,
    error,
  };
};