import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';
import { testimonialService } from '@/services/testimonial.service';

export const useDeleteTestimonials = () => {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();
  const queryClient = useQueryClient();

  const deleteTestimonials = useMutation({
    mutationFn: (ids: string[]) =>
      testimonialService.deleteMany(
        currentOrganization!,
        ids,
        session?.user?.accessToken!
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['testimonials', 'pending', currentOrganization],
      });
    },
  });

  return deleteTestimonials;
};
