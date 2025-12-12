import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';
import { testimonialService } from '@/services/testimonial.service';

export const useDeleteTestimonials = () => {
  const { data: session } = useSession();
  const { currentOrganization, role: storedRole } = useStore();
  const queryClient = useQueryClient();

  const userRole = storedRole?.toLowerCase() || '';
  const isAdmin = userRole === 'admin';

  const deleteTestimonials = useMutation({
    mutationFn: async (ids: string[]) => {
      if (isAdmin) {
        return await testimonialService.deleteMany(
          currentOrganization!,
          ids,
          session?.user?.accessToken!
        );
      } else {
        // Para editores, eliminar uno por uno usando el endpoint de usuario
        await Promise.all(
          ids.map((id) =>
            testimonialService.deleteForUser(
              id,
              session?.user?.accessToken!
            )
          )
        );
      }
    },
    onSuccess: () => {
      // Invalidar las queries según el rol
      if (isAdmin) {
        queryClient.invalidateQueries({
          queryKey: ['testimonials', 'pending', currentOrganization],
        });
        queryClient.invalidateQueries({
          queryKey: ['testimonials', 'pending-widget', currentOrganization],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ['testimonials', 'pending', 'user'],
        });
        queryClient.invalidateQueries({
          queryKey: ['testimonials', 'pending-widget', 'user'],
        });
      }
    },
  });

  return deleteTestimonials;
};
