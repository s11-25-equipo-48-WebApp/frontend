import Button from "@/components/Button";
import type { Testimonial } from "@/services/testimonial.service";

interface TestimonialTableProps {
  testimonials: Testimonial[];
  selectedIds: string[];
  selectAll: boolean;
  filterBy: string;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export default function TestimonialTable({
  testimonials,
  selectedIds,
  selectAll,
  filterBy,
  onToggleSelectAll,
  onToggleSelect,
  onViewDetails,
}: TestimonialTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-6 py-4">
              <input
                type="checkbox"
                checked={selectAll && testimonials.length > 0}
                onChange={onToggleSelectAll}
                disabled={testimonials.length === 0}
                className="w-5 h-5 rounded border-gray-300 text-gray-700 focus:ring-2 focus:ring-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              />
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
              Cliente/Curso
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
              Recibido
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
              Editor
            </th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
              Contenido
            </th>
            <th className="text-right px-6 py-4"></th>
          </tr>
        </thead>
        <tbody>
          {testimonials.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                {filterBy
                  ? "No se encontraron testimonios con los filtros aplicados"
                  : ""}
              </td>
            </tr>
          ) : (
            testimonials.map((testimonial) => {
              const isSelected = selectedIds.includes(testimonial.id);

              return (
                <tr
                  key={testimonial.id}
                  className={`border-b border-gray-50 transition-colors ${
                    isSelected ? "bg-red-50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(testimonial.id)}
                      className="w-5 h-5 rounded border-gray-300 text-gray-700 focus:ring-2 focus:ring-gray-200 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">
                      {testimonial.client}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.course}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {testimonial.received}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {testimonial.editor}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {testimonial.content}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      type="button"
                      onClick={() => onViewDetails(testimonial.id)}
                      variant="primary"
                      color="orange"
                      size="fit"
                      className="text-sm! px-4 py-2"
                    >
                      Ver detalles
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
