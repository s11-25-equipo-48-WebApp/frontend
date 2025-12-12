"use client";
import { useForm, FormProvider } from "react-hook-form";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { usePendingTestimonials } from "@/hooks/usePendingTestimonials";
import { useCategories } from "@/hooks/useCategories";
import { FilterType, SortType } from "@/utils/testimonial.utils";
import TestimonialFilters from "@/components/dashboard/TestimonialFilters";
import TestimonialTable from "@/components/dashboard/TestimonialTable";
import DeleteModal from "@/components/Modals/DeleteModal";
import { useDeleteTestimonials } from "@/hooks/useDeleteTestimonials";
import { useTestimonialSelection } from "@/hooks/useTestimonialsSelection";
import { useStore } from "@/store/zustand";

interface FilterFormData {
  filterBy: FilterType;
  sortBy: SortType;
}

export default function PendingReviewsPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: session } = useSession();
  const { currentOrganization } = useStore();

  // Obtener el rol de la organización actual desde la sesión
  const currentOrgRole = session?.user?.organizations
    ?.find((org) => org.id === currentOrganization)
    ?.role?.toLowerCase();

  const isAdmin = currentOrgRole === "admin";

  const methods = useForm<FilterFormData>({
    defaultValues: { filterBy: "", sortBy: "" },
  });

  const filterBy = methods.watch("filterBy");
  const sortBy = methods.watch("sortBy");

  const { testimonials, rawTestimonials, isLoading, hasOrganization } =
    usePendingTestimonials(filterBy, sortBy);

  // Cargar categorías solo si es admin y tiene organización
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const deleteTestimonials = useDeleteTestimonials();
  const {
    selectedIds,
    selectAll,
    hasSelected,
    toggleSelectAll,
    toggleSelect,
    clearSelection,
  } = useTestimonialSelection(testimonials);

  // Calcular si hay filtros u ordenamiento activos
  const hasActiveFilters = useMemo(() => {
    return filterBy !== "" || sortBy !== "";
  }, [filterBy, sortBy]);

  // Calcular el texto del filtro activo
  const getFilterLabel = useMemo(() => {
    if (!filterBy) return null;

    if (filterBy.startsWith("category:")) {
      const categoryId = filterBy.replace("category:", "");
      const category = categories.find((c) => c.id === categoryId);
      return category
        ? `Categoría: ${category.name}`
        : "Categoría seleccionada";
    }

    const filterLabels: Record<string, string> = {
      video: "Videos",
      image: "Imágenes",
      text: "Textos",
    };

    return filterLabels[filterBy] || "Filtro activo";
  }, [filterBy, categories]);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTestimonials.mutateAsync(selectedIds);
      clearSelection();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar testimonios:", error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    methods.setValue("filterBy", e.target.value as FilterType);
    clearSelection();
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

  // Solo bloquear si es admin y no tiene organización
  if (isAdmin && !hasOrganization) {
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
          <h1 className="text-2xl font-bold text-gray-800">
            Testimonios Pendientes
          </h1>
          <p className="text-gray-600 mt-1">
            Revisa y gestiona los testimonios que están pendientes de aprobación
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
              categories={categories}
              isLoadingCategories={isLoadingCategories}
            />

            {/* Contador de resultados - siempre visible cuando hay filtros activos */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">
                  Mostrando {testimonials.length} de {rawTestimonials.length}{" "}
                  testimonios
                </span>
                {getFilterLabel && (
                  <span className="text-gray-500">
                    • Filtro: {getFilterLabel}
                  </span>
                )}
              </div>
            )}

            {/* Tabla de testimonios */}
            <TestimonialTable
              testimonials={testimonials}
              selectedIds={selectedIds}
              selectAll={selectAll}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelect={toggleSelect}
            />

            {/* Mensaje si no hay testimonios */}
            {testimonials.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {hasActiveFilters
                    ? "No se encontraron testimonios con los filtros aplicados"
                    : "No hay testimonios pendientes de revisión"}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      methods.reset();
                      clearSelection();
                    }}
                    className="mt-4 text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    Limpiar filtros y ver todos
                  </button>
                )}
              </div>
            )}
          </form>
        </FormProvider>

        {/* Modal de confirmación de eliminación */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title={`Eliminar ${selectedIds.length} Testimonio${
            selectedIds.length > 1 ? "s" : ""
          }`}
          message={`¿Estás seguro de que deseas eliminar ${
            selectedIds.length
          } testimonio${
            selectedIds.length > 1 ? "s" : ""
          }? Esta acción no se puede deshacer.`}
          confirmButtonText="Eliminar"
          isLoading={deleteTestimonials.isPending}
        />
      </div>
    </div>
  );
}
