import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/zustand";
import { organizationService } from "@/services/organization.service";

export const useOrganization = () => {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();

  const {
    data: organization,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organization", currentOrganization],
    queryFn: async () => {
      return await organizationService.getById(
        currentOrganization!,
        session?.user?.accessToken!
      );
    },
    enabled: !!currentOrganization && !!session?.user?.accessToken,
    staleTime: 10 * 60 * 1000, // 10 minutos (los datos de org no cambian frecuentemente)
  });

  return {
    organization,
    isLoading,
    error,
    hasOrganization: !!currentOrganization,
  };
};