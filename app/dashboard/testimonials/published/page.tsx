'use client';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { useState } from 'react';
import { usePublicTestimonials } from '@/hooks/usePublicTestimonials';
import { FilterType, SortType } from '@/utils/testimonial.utils';
import TestimonialFilters from '@/components/dashboard/TestimonialFilters';
import TestimonialTable from '@/components/dashboard/TestimonialTable';
import DeleteModal from '@/components/Modals/DeleteModal';
import { useDeleteTestimonials } from '@/hooks/useDeleteTestimonials';
import { useTestimonialSelection } from '@/hooks/useTestimonialsSelection';

interface FilterFormData {
  filterBy: FilterType;
  sortBy: SortType;
}

export default function PublicTestimonialsPage() {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const methods = useForm<FilterFormData>({
    defaultValues: { filterBy: '', sortBy: '' },
  });

  const filterBy = methods.watch('filterBy');
  const sortBy = methods.watch('sortBy');

  const { testimonials, rawTestimonials, isLoading, hasOrganization } = usePublicTestimonials(
    filterBy,
    sortBy
  );
  const deleteTestimonials = useDeleteTestimonials();
  const { selectedIds, selectAll, hasSelected, toggleSelectAll, toggleSelect, clearSelection } =
    useTestimonialSelection(testimonials);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTestimonials.mutateAsync(selectedIds);
      clearSelection();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar testimonios:', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    methods.setValue('filterBy', e.target.value as FilterType);
    clearSelection();
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/testimonials/${id}`);
  };

  // Loading state
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
          <h1 className="text-2xl font-bold text-gray-800">Testimonios Publicados</h1>
          <p className="text-gray-600 mt-1">
            Gestiona todos los testimonios aprobados y visibles públicamente
          </p>
        </div>

        <FormProvider {...methods}>
          <form className="space-y-6">
            {/* Filtros y acciones */}
            <TestimonialFilters
              methods={methods}
              hasSelected={hasSelected}
              selectedCount={selectedIds.length}
              isDeleting={deleteTestimonials.isPending}
              onDelete={handleDeleteClick}
              onFilterChange={handleFilterChange}
            />

            {/* Contador de resultados filtrados */}
            {filterBy && (
              <div className="text-sm text-gray-600">
                Mostrando {testimonials.length} de {rawTestimonials.length} testimonios
              </div>
            )}

            {/* Tabla de testimonios */}
            <TestimonialTable
              testimonials={testimonials}
              selectedIds={selectedIds}
              selectAll={selectAll}
              filterBy={filterBy}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelect={toggleSelect}
              onViewDetails={handleViewDetails}
            />

            {/* Mensaje si no hay testimonios */}
            {testimonials.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {filterBy
                    ? 'No se encontraron testimonios con los filtros aplicados'
                    : 'No hay testimonios publicados aún'}
                </p>
              </div>
            )}
          </form>
        </FormProvider>

        {/* Modal de confirmación de eliminación */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title={`Eliminar ${selectedIds.length} Testimonio${selectedIds.length > 1 ? 's' : ''}`}
          message={`¿Estás seguro de que deseas eliminar ${selectedIds.length} testimonio${
            selectedIds.length > 1 ? 's' : ''
          }? Esta acción no se puede deshacer.`}
          confirmButtonText="Eliminar"
          isLoading={deleteTestimonials.isPending}
        />
      </div>
    </div>
  );
}