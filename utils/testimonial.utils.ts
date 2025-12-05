import { Testimonial, TestimonialAPIResponse } from "@/services/testimonial.service";

// ============================================
// TIPOS DE FILTROS Y ORDENAMIENTO
// ============================================

export type FilterType = '' | 'video' | 'text' | 'positive' | 'negative';
export type SortType = '' | 'date-desc' | 'date-asc' | 'client' | 'editor';

// ============================================
// TRANSFORMADORES (API → UI)
// ============================================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const getContentType = (apiData: TestimonialAPIResponse): string => {
  const mediaType = apiData.media_type === 'video' ? 'Video' : 
                    apiData.media_type === 'image' ? 'Imagen' : 'Texto';
  
  const sentiment = apiData.tags.find(tag => 
    ['positivo', 'negativo', 'muy positivo', 'neutral'].includes(tag.toLowerCase())
  );
  
  return sentiment ? `${mediaType} / ${sentiment}` : mediaType;
};

/**
 * Transforma un testimonio de la API al formato de la UI
 */
export const transformAPIToTestimonial = (apiData: TestimonialAPIResponse): Testimonial => {
  return {
    id: apiData.id,
    client: apiData.author,
    course: apiData.title,
    received: formatDate(apiData.created_at),
    editor: 'Sin asignar',
    content: getContentType(apiData),
  };
};

// ============================================
// FILTROS
// ============================================

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

// ============================================
// ORDENAMIENTO
// ============================================

/**
 * Parsea una fecha en formato español "30 jun 2025" a Date
 */
const parseSpanishDate = (dateStr: string): Date => {
  const months: { [key: string]: number } = {
    'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
    'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
  };
  
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = months[parts[1].toLowerCase()];
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  
  // Fallback: intentar parsear como fecha ISO
  return new Date(dateStr);
};

export const sortTestimonials = (
  testimonials: Testimonial[],
  sortBy: SortType
): Testimonial[] => {
  if (!sortBy) return testimonials;

  const sorted = [...testimonials];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc': {
        const dateA = parseSpanishDate(a.received);
        const dateB = parseSpanishDate(b.received);
        return dateB.getTime() - dateA.getTime();
      }
      
      case 'date-asc': {
        const dateA = parseSpanishDate(a.received);
        const dateB = parseSpanishDate(b.received);
        return dateA.getTime() - dateB.getTime();
      }
      
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