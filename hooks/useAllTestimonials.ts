import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';
import { testimonialService } from '@/services/testimonial.service';
import { 
  filterTestimonials, 
  filterTestimonialsByStatus,
  sortTestimonials, 
  FilterType, 
  SortType,
  StatusFilter 
} from '@/utils/testimonial.utils';

export const useAllTestimonials = (
  filterBy: FilterType = '',
  sortBy: SortType = '',
  statusFilter: StatusFilter = '',
  page: number = 1,
  limit: number = 50
) => {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();

  const { data: rawTestimonials = [], isLoading, error } = useQuery({
    queryKey: ['testimonials', 'all', currentOrganization, page, limit],
    queryFn: () =>
      testimonialService.getAll(
        currentOrganization!,
        session?.user?.accessToken!,
        page,
        limit
      ),
    enabled: !!currentOrganization && !!session?.user?.accessToken,
    staleTime: 5 * 60 * 1000, 
  });

  let processedTestimonials = [...rawTestimonials];

  if (statusFilter) {
    processedTestimonials = filterTestimonialsByStatus(processedTestimonials, statusFilter);
  }

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
    hasOrganization: !!currentOrganization,
  };
};