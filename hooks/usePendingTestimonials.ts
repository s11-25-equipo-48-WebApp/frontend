import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/zustand";
import { testimonialService } from "@/services/testimonial.service";
import {
  filterTestimonials,
  sortTestimonials,
  FilterType,
  SortType,
} from "@/utils/testimonial.utils";

export const usePendingTestimonials = (
  filterBy: FilterType = "",
  sortBy: SortType = "",
  page: number = 1,
  limit: number = 50
) => {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();

  // Obtener el rol de la organización actual desde la sesión
  const currentOrgRole = session?.user?.organizations
    ?.find((org) => org.id === currentOrganization)
    ?.role?.toLowerCase();

  const isAdmin = currentOrgRole === "admin";

  const {
    data: rawTestimonials = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "testimonials",
      "pending",
      isAdmin ? currentOrganization : "user",
      page,
      limit,
    ],
    queryFn: () => {
      if (isAdmin) {
        // Admin: obtener todos los testimonios pendientes de la organización
        return testimonialService.getPending(
          currentOrganization!,
          session?.user?.accessToken!,
          page,
          limit
        );
      } else {
        // Editor: obtener solo sus testimonios pendientes
        return testimonialService.getPendingForUser(
          session?.user?.accessToken!,
          page,
          limit
        );
      }
    },
    enabled:
      (isAdmin ? !!currentOrganization : true) && !!session?.user?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Filtrar solo testimonios pendientes
  let processedTestimonials = rawTestimonials.filter(
    (t) => t.status === "pendiente"
  );

  // Aplicar filtros y ordenamiento en el cliente
  if (filterBy) {
    processedTestimonials = filterTestimonials(processedTestimonials, filterBy);
  }

  if (sortBy) {
    processedTestimonials = sortTestimonials(processedTestimonials, sortBy);
  }

  return {
    testimonials: processedTestimonials,
    rawTestimonials,
    isLoading,
    error,
    hasOrganization: isAdmin ? !!currentOrganization : true,
  };
};
