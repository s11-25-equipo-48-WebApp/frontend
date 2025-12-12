import {
  Testimonial,
  TestimonialAPIResponse,
} from "@/services/testimonial.service";

// TIPOS DE FILTROS Y ORDENAMIENTO

export type FilterType = "" | "video" | "image" | "text" | `category:${string}`;
export type SortType =
  | ""
  | "date-desc"
  | "date-asc"
  | "titulo"
  | "medio"
  | "categoria";
export type StatusFilter = "" | "pendiente" | "aprobado" | "rechazado";

// TRANSFORMADORES (API → UI)

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const months = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Transforma un testimonio de la API al formato de la UI
 * Maneja casos donde los campos pueden ser null o undefined
 */
export const transformAPIToTestimonial = (
  apiTestimonial: TestimonialAPIResponse
): Testimonial => {
  return {
    id: apiTestimonial.id,
    author_name: apiTestimonial.author_name || "Anónimo",
    title: apiTestimonial.title || "Sin título",
    categoryName: apiTestimonial.category?.name || "General",
    categoryId: apiTestimonial.category?.id || "",
    mediaType: apiTestimonial.media_type || "none",
    content: apiTestimonial.body || "",
    createdAt: apiTestimonial.created_at,
    formattedDate: formatDate(apiTestimonial.created_at),
    editor: apiTestimonial.created_by_user
      ? `${apiTestimonial.created_by_user.name} ${apiTestimonial.created_by_user.last_name}`
      : "Sistema",
    media_url: apiTestimonial.media_url,
    media_type: apiTestimonial.media_type,
    image: apiTestimonial.media_url || null,
    email: apiTestimonial.author_email || null,
    category_id: apiTestimonial.category?.id || null,
    created_at: apiTestimonial.created_at,
    received: apiTestimonial.created_at,
    author: apiTestimonial.author_name || null,
    body: apiTestimonial.body || "",
    status: apiTestimonial.status,
  };
};

// FILTROS

/**
 * Filtra testimonios por tipo de medio o categoría
 */
export const filterTestimonials = (
  testimonials: Testimonial[],
  filterBy: FilterType
): Testimonial[] => {
  if (!filterBy) return testimonials;

  return testimonials.filter((testimonial) => {
    if (filterBy.startsWith("category:")) {
      const categoryId = filterBy.replace("category:", "");
      return testimonial.categoryId === categoryId;
    }

    switch (filterBy) {
      case "video":
        return testimonial.mediaType === "video";
      case "image":
        return testimonial.mediaType === "image";
      case "text":
        return testimonial.mediaType === "none";
      default:
        return true;
    }
  });
};

/**
 * Filtra testimonios por estado
 */
export const filterTestimonialsByStatus = (
  testimonials: Testimonial[],
  statusFilter: StatusFilter
): Testimonial[] => {
  if (!statusFilter) return testimonials;
  return testimonials.filter((t) => t.status === statusFilter);
};

// ORDENAMIENTO

/**
 * Parsea una fecha en formato español "30 jun 2025" a Date
 */
const parseSpanishDate = (dateStr: string): Date => {
  const months: { [key: string]: number } = {
    ene: 0,
    feb: 1,
    mar: 2,
    abr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    ago: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dic: 11,
  };

  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = months[parts[1].toLowerCase()];
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }

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
      case "date-desc": {
        const dateA = parseSpanishDate(a.formattedDate);
        const dateB = parseSpanishDate(b.formattedDate);
        return dateB.getTime() - dateA.getTime();
      }

      case "date-asc": {
        const dateA = parseSpanishDate(a.formattedDate);
        const dateB = parseSpanishDate(b.formattedDate);
        return dateA.getTime() - dateB.getTime();
      }

      case "titulo":
        return a.title.localeCompare(b.title);

      case "medio":
        return a.mediaType.localeCompare(b.mediaType);

      case "categoria":
        return a.categoryName.localeCompare(b.categoryName);

      default:
        return 0;
    }
  });

  return sorted;
}