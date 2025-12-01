import api from '@/services/config';

export interface Testimonial {
  id: string;
  client: string;
  course: string;
  received: string;
  editor: string;
  content: string;
}

// Queries
export const testimonialQueries = {
  pending: async (): Promise<Testimonial[]> => {
    const response = await api.get('/testimonials/pending');
    return response.data;
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    await api.delete('/testimonials', { data: { ids } });
  },
};

// Mock data para desarrollo
export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    client: 'Juan P.',
    course: 'Python Avanzado',
    received: 'Jun 24, 2025',
    editor: 'María Rodríguez',
    content: 'Video / positivo',
  },
  {
    id: '2',
    client: 'Natan B.',
    course: 'Full Stack Pro',
    received: 'Mar 10, 2025',
    editor: 'Lorena Todd',
    content: 'Texto / negativo',
  },
  {
    id: '3',
    client: 'Rodrigo G.',
    course: 'Python Principiante',
    received: 'Nov 10, 2025',
    editor: 'María Rodríguez',
    content: 'Texto / muy positivo',
  },
  {
    id: '4',
    client: 'Orlando D.',
    course: 'Automatización con S...',
    received: 'Nov 25, 2025',
    editor: 'Bruno Foster',
    content: 'Video / positivo',
  },
  {
    id: '5',
    client: 'Andi L.',
    course: 'Full Stark Pro',
    received: 'Dec 5, 2025',
    editor: 'María Rodríguez',
    content: 'Video / positivo',
  },
  {
    id: '6',
    client: 'Laura C.',
    course: 'Python Avanzado',
    received: 'Dec 10, 2025',
    editor: 'Amanda Santos',
    content: 'Texto / negativo serio',
  },
  {
    id: '7',
    client: 'Andi L.',
    course: 'Full Stark Pro',
    received: 'Dec 24, 2025',
    editor: 'Oliver Harmon',
    content: 'Video / positivo',
  },
];