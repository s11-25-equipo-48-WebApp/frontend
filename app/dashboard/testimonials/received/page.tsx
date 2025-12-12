'use client';
import { useForm, FormProvider } from 'react-hook-form';
import { useMemo } from 'react';
import { useAllTestimonials } from '@/hooks/useAllTestimonials';
import { useCategories } from '@/hooks/useCategories';
import { FilterType, SortType } from '@/utils/testimonial.utils';
import AllTestimonialsFilters from '@/components/dashboard/AllTestimonialsFilters';
import AllTestimonialsTable from '@/components/dashboard/AllTestimonialsTable';

interface FilterFormData {
  filterBy: FilterType;
  sortBy: SortType;
  statusFilter: string;
}

export default function AllTestimonialsPage() {
  const methods = useForm<FilterFormData>({
    defaultValues: { filterBy: '', sortBy: '', statusFilter: '' },
  });

  const filterBy = methods.watch('filterBy');
  const sortBy = methods.watch('sortBy');
  const statusFilter = methods.watch('statusFilter');

  const { testimonials, rawTestimonials, isLoading, hasOrganization } = useAllTestimonials(
    filterBy,
    sortBy,
    (statusFilter as any) || undefined 
  );

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const hasActiveFilters = useMemo(() => {
    return filterBy !== '' || sortBy !== '' || statusFilter !== '';
  }, [filterBy, sortBy, statusFilter]);

  const getFilterLabel = useMemo(() => {
    const labels: string[] = [];

    if (statusFilter) {
      const statusLabels: Record<string, string> = {
        'aprobado': 'Aprobados',
        'rechazado': 'Rechazados',
        'pendiente': 'Pendientes',
      };
      labels.push(`Estado: ${statusLabels[statusFilter]}`);
    }

    if (filterBy) {
      if (filterBy.startsWith('category:')) {
        const categoryId = filterBy.replace('category:', '');
        const category = categories.find(c => c.id === categoryId);
        if (category) labels.push(`Categoría: ${category.name}`);
      } else {
        const filterLabels: Record<string, string> = {
          'video': 'Videos',
          'image': 'Imágenes',
          'text': 'Textos',
        };
        labels.push(filterLabels[filterBy]);
      }
    }

    return labels.length > 0 ? labels.join(' • ') : null;
  }, [filterBy, statusFilter, categories]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    methods.setValue('filterBy', e.target.value as FilterType);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    methods.setValue('statusFilter', e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando testimonios...</p>
        </div>
      </div>
    );
  }

  if (!hasOrganization) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Por favor selecciona una organización</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Testimonios Recibidos</h1>
          <p className="text-gray-600 mt-1">
            Visualiza todos los testimonios recibidos en tu organización
          </p>
        </div>

        <FormProvider {...methods}>
          <form className="space-y-6">
            {/* Filtros */}
            <AllTestimonialsFilters
              methods={methods}
              onFilterChange={handleFilterChange}
              onStatusFilterChange={handleStatusFilterChange}
              categories={categories}
              isLoadingCategories={isLoadingCategories}
            />

            {/* Contador de resultados */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">
                  Mostrando {testimonials.length} de {rawTestimonials.length} testimonios
                </span>
                {getFilterLabel && (
                  <span className="text-gray-500">
                    • Filtro: {getFilterLabel}
                  </span>
                )}
              </div>
            )}

            {/* Tabla de testimonios */}
            <AllTestimonialsTable testimonials={testimonials} />

            {/* Mensaje si no hay testimonios */}
            {testimonials.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {hasActiveFilters
                    ? 'No se encontraron testimonios con los filtros aplicados'
                    : 'No hay testimonios recibidos'}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => methods.reset()}
                    className="mt-4 text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    Limpiar filtros y ver todos
                  </button>
                )}
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}