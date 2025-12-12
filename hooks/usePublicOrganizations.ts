// hooks/usePublicOrganizations.ts
// hooks/usePublicOrganizations.ts
import { useQuery } from "@tanstack/react-query";
import { organizationsService } from "@/services/organizations.service";

export interface Organization {
  id: string;
  name: string;
  description?: string;
}

export const usePublicOrganizations = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-organizations"],
    queryFn: () => organizationsService.getPublic(),
  });

  return {
    organizations: (data?.data as Organization[]) ?? [],
    meta: data?.meta,
    isLoading,
    error,
  };
};
