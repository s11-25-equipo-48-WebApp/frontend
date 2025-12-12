import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/zustand";
import { testimonialService } from "@/services/testimonial.service";

/**
 * Hook específico para el widget de testimonios pendientes en el dashboard
 * Obtiene un número limitado de testimonios pendientes (por defecto 4)
 */
export const usePendingTestimonialsWidget = (limit: number = 4) => {
  const { data: session } = useSession();
  const { currentOrganization, role: storedRole } = useStore();

  const userRole = storedRole?.toLowerCase() || "";
  const isAdmin = userRole === "admin";

  const {
    data: rawTestimonials = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "testimonials",
      "pending-widget",
      isAdmin ? currentOrganization : "user",
      limit,
    ],
    queryFn: async () => {
      if (isAdmin) {
        return await testimonialService.getPending(
          currentOrganization!,
          session?.user?.accessToken!,
          1,
          limit
        );
      } else {
        return await testimonialService.getPendingForUser(
          session?.user?.accessToken!,
          1,
          limit
        );
      }
    },
    enabled:
      (isAdmin ? !!currentOrganization : true) && !!session?.user?.accessToken,
    staleTime: 2 * 60 * 1000, // 2 minutos - más corto para el widget
    refetchInterval: 5 * 60 * 1000, // Refresca cada 5 minutos automáticamente
  });

  // Filtrar solo testimonios pendientes
  const testimonials = rawTestimonials.filter((t) => t.status === "pendiente");

  return {
    testimonials,
    count: testimonials.length,
    isLoading,
    error,
    hasOrganization: isAdmin ? !!currentOrganization : true,
  };
};
