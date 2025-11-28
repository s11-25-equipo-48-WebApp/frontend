import { useQuery } from '@tanstack/react-query';
import api from '@/services/config';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';

interface Category {
    id: string;
    name: string;
    description?: string;
}

export function useCategories() {
    const { data: session } = useSession()
    const { currentOrganization } = useStore();

    return useQuery({
        queryKey: ['categories', currentOrganization],
        queryFn: async () => {
            const response = await api.get<Category[]>(`/organizations/${currentOrganization}/categories`, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                }
            });
            return response.data;
        },
        enabled: !!currentOrganization && !!session?.user?.accessToken,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}
