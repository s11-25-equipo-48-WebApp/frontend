import { Testimonial } from "@/services/dashboard.service";

export type FilterType = '' | 'video' | 'text' | 'positive' | 'negative';
export type SortType = '' | 'date-desc' | 'date-asc' | 'client' | 'editor';

export const filterTestimonials = (
  testimonials: Testimonial[],
  filterBy: FilterType
): Testimonial[] => {
  if (!filterBy) return testimonials;

  return testimonials.filter((testimonial) => {
    const content = testimonial.content.toLowerCase();
    
    switch (filterBy) {
      case 'video':
        return content.includes('video');
      case 'text':
        return content.includes('texto');
      case 'positive':
        return content.includes('positivo') && !content.includes('negativo');
      case 'negative':
        return content.includes('negativo');
      default:
        return true;
    }
  });
};

export const sortTestimonials = (
  testimonials: Testimonial[],
  sortBy: SortType
): Testimonial[] => {
  if (!sortBy) return testimonials;

  const sorted = [...testimonials];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.received).getTime() - new Date(a.received).getTime();
      
      case 'date-asc':
        return new Date(a.received).getTime() - new Date(b.received).getTime();
      
      case 'client':
        return a.client.localeCompare(b.client);
      
      case 'editor':
        return a.editor.localeCompare(b.editor);
      
      default:
        return 0;
    }
  });

  return sorted;
};