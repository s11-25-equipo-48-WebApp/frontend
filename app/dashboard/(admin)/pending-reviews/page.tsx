'use client';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { useTestimonials, useTestimonialSelection } from '@/hooks/useTestimonials';
import { FilterType, SortType } from '@/utils/testimonial.utils';
import TestimonialFilters from '@/components/dashboard/TestimonialFilters';
import TestimonialTable from '@/components/dashboard/TestimonialTable';

interface FilterFormData {
  filterBy: FilterType;
  sortBy: SortType;
}

export default function PendingReviewsPage() {
  const router = useRouter();
  
  const methods = useForm<FilterFormData>({
    defaultValues: { filterBy: '', sortBy: '' }
  });

  const filterBy = methods.watch('filterBy');
  const sortBy = methods.watch('sortBy');

  const { testimonials, rawTestimonials, isLoading, deleteTestimonials } = 
    useTestimonials(filterBy, sortBy);
  
  const { selectedIds, selectAll, hasSelected, toggleSelectAll, toggleSelect, clearSelection } = 
    useTestimonialSelection(testimonials);

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar ${selectedIds.length} testimonio(s)?`)) {
      deleteTestimonials.mutate(selectedIds, {
        onSuccess: () => clearSelection()
      });
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    methods.setValue('filterBy', e.target.value as FilterType);
    clearSelection();
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/revisiones/${id}`);
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

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <FormProvider {...methods}>
          <form className="space-y-6">
            {/* Filters and Actions */}
            <TestimonialFilters
              methods={methods}
              hasSelected={hasSelected}
              selectedCount={selectedIds.length}
              isDeleting={deleteTestimonials.isPending}
              onDelete={handleDelete}
              onFilterChange={handleFilterChange}
            />

            {/* Resultados */}
            {filterBy && (
              <div className="text-sm text-gray-600">
                Mostrando {testimonials.length} de {rawTestimonials.length} testimonios
              </div>
            )}

            {/* Table */}
            <TestimonialTable
              testimonials={testimonials}
              selectedIds={selectedIds}
              selectAll={selectAll}
              filterBy={filterBy}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelect={toggleSelect}
              onViewDetails={handleViewDetails}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}