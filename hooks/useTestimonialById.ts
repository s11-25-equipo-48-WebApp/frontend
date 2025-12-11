import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/zustand";
import { testimonialService } from "@/services/testimonial.service";

export const useTestimonialById = (id: string) => {
  const { data: session } = useSession();
  const organizationId = useStore((s) => s.currentOrganization);

  const {
    data: testimonial,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["testimonials", "byId", organizationId, id],
    queryFn: () =>
      testimonialService.getById(
        organizationId!,
        id,
        session?.user?.accessToken!
      ),
    enabled: !!organizationId && !!session?.user?.accessToken && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    testimonial,
    isLoading,
    error,
    hasOrganization: !!organizationId,
  };
};
