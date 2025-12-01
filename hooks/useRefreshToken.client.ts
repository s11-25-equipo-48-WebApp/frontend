import api from "@/services/config";
import { useSession } from "next-auth/react";

export default function useRefreshAccessTokenClient() {
  const { data: session, update } = useSession();

  const refresh = async (): Promise<string | null> => {
    try {
      const token = session?.user?.accessToken as string | undefined;
      const { data } = await api.post(
        "/auth/refresh",
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      const newToken = data?.accessToken;
      if (newToken) {
        try {
          await update?.({
            user: { ...(session?.user as any), accessToken: newToken },
          });
        } catch (e) {
          // ignore update errors
        }
        return newToken;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  return refresh;
}
