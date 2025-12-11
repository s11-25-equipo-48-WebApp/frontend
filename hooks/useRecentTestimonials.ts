import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/zustand";
import { testimonialService } from "@/services/testimonial.service";

export const useRecentTestimonials = (limit: number = 5) => {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();

  const {
    data: rawTestimonials = [],
    isLoading,
  } = useQuery({
    queryKey: ["testimonials", "recent", currentOrganization, limit],
    queryFn: async () => {
      const result = await testimonialService.getRecent(
        currentOrganization!,
        session?.user?.accessToken!,
        limit
      );

      return result;
    },
    enabled: !!currentOrganization && !!session?.user?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Filtrar solo testimonios aprobados
  const testimonials = rawTestimonials.filter(
    (t) => t.status === "aprobado"
  );

  return {
    testimonials,
    isLoading,
    hasOrganization: !!currentOrganization,
  };
};
