import { UseFormReturn } from "react-hook-form";
import { FilterType, SortType } from "@/utils/testimonial.utils";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface FilterFormData {
  filterBy: FilterType;
  sortBy: SortType;
  statusFilter: string;
}

interface AllTestimonialsFiltersProps {
  methods: UseFormReturn<FilterFormData>;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  categories?: Category[];
  isLoadingCategories?: boolean;
}

export default function AllTestimonialsFilters({
  methods,
  onFilterChange,
  onStatusFilterChange,
  categories = [],
  isLoadingCategories = false,
}: AllTestimonialsFiltersProps) {
  return (
    <div className="flex items-center justify-end gap-4">
      {/* Filtro por Estado */}
      <select
        {...methods.register("statusFilter")}
        onChange={onStatusFilterChange}
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100"
      >
        <option value="">Todos los estados</option>
        <option value="aprobado">Aprobados</option>
        <option value="rechazado">Rechazados</option>
        <option value="pendiente">Pendientes</option>
      </select>

      {/* Filtro por Tipo/Categoría */}
      <select
        {...methods.register("filterBy")}
        onChange={onFilterChange}
        disabled={isLoadingCategories}
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Filtrar</option>
        
        {/* Filtros por tipo de medio */}
        <optgroup label="Tipo de contenido">
          <option value="video">Solo videos</option>
          <option value="image">Solo imágenes</option>
          <option value="text">Solo textos</option>
        </optgroup>

        {/* Filtros por categoría (dinámico) */}
        {categories.length > 0 && (
          <optgroup label="Categorías">
            {categories.map((category) => (
              <option key={category.id} value={`category:${category.id}`}>
                {category.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>

      {/* Ordenar */}
      <select
        {...methods.register("sortBy")}
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100"
      >
        <option value="">Ordenar por</option>
        <option value="date-desc">Más recientes</option>
        <option value="date-asc">Más antiguos</option>
        <option value="titulo">Título (A-Z)</option>
        <option value="medio">Medio (A-Z)</option>
        <option value="categoria">Categoría (A-Z)</option>
      </select>
    </div>
  );
}