import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { userService, UpdateUserData, User } from "@/services/user.service";
import useRefreshAccessTokenClient from "@/hooks/useRefreshToken.client";

export const useUser = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshToken = useRefreshAccessTokenClient();

  const getCurrentUser = async (): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newToken = await refreshToken();
      const tokenToUse =
        newToken ?? (session?.user?.accessToken as string | undefined);

      if (!tokenToUse) {
        throw new Error("No hay token de autenticación disponible");
      }

      const user = await userService.getCurrentUser(tokenToUse);
      return user;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al obtener usuario";
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
      const newToken = await refreshToken();
      const tokenToUse =
        newToken ?? (session?.user?.accessToken as string | undefined);

      if (!tokenToUse) {
        throw new Error("No hay token de autenticación disponible");
      }

      const updatedUser = await userService.updateUser(userData, tokenToUse);

      toast.update(loadingToast, {
        render: "¡Perfil actualizado exitosamente!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return updatedUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar usuario";
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
