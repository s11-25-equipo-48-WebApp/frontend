import { Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FilterType, SortType } from "@/utils/testimonial.utils";

interface FilterFormData {
  filterBy: FilterType;
  sortBy: SortType;
}

interface TestimonialFiltersProps {
  methods: UseFormReturn<FilterFormData>;
  hasSelected: boolean;
  selectedCount: number;
  isDeleting: boolean;
  onDelete: () => void;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function TestimonialFilters({
  methods,
  hasSelected,
  selectedCount,
  isDeleting,
  onDelete,
  onFilterChange,
}: TestimonialFiltersProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {hasSelected && (
          <>
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="w-12 h-12 rounded-full bg-red-100 hover:bg-red-200 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
              ) : (
                <Trash2 className="w-5 h-5 text-red-500" />
              )}
            </button>
            <span className="text-sm text-gray-600">
              {selectedCount} seleccionado(s)
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <select
          {...methods.register("filterBy")}
          onChange={onFilterChange}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100"
        >
          {/*Tengo que tener en cuenta que las categorías pueden cambiar (debo hacer un get de las categorías que hay disponibles por el momento) */}
          <option value="">Filtrar</option>
          <option value="video">Solo videos</option>
          <option value="text">Solo textos</option>
          <option value="positive">Solo positivos</option>
          <option value="negative">Solo negativos</option>
        </select>

        <select
          {...methods.register("sortBy")}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100"
        >
          <option value="">Ordenar por</option>
          <option value="date-desc">Más recientes</option>
          <option value="date-asc">Más antiguos</option>
          <option value="client">Cliente (A-Z)</option>
          <option value="editor">Editor (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
