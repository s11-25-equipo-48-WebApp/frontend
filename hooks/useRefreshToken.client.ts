import api from "@/services/config";
import { useSession } from "next-auth/react";

export const useRefreshAccessTokenClient = async () => {
    const { data: session, update } = useSession()
    const { data } = await api.post('/auth/refresh', {
        headers: {
            'Authorization': `Bearer ${session?.user?.accessToken}`
        }
    });
    await update({
        user: {
            accessToken: data.accessToken,
        }
    });
}