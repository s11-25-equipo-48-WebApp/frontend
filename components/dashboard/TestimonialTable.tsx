import { Testimonial } from "@/services/testimonial.service";
import Link from "next/link";
import { useStore } from "@/store/zustand";

interface TestimonialTableProps {
  testimonials: Testimonial[];
  selectedIds: string[];
  selectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
}

export default function TestimonialTable({
  testimonials,
  selectedIds,
  selectAll,
  onToggleSelectAll,
  onToggleSelect,
}: TestimonialTableProps) {
  const { role: userRole } = useStore();

  const isAdmin = userRole?.toLowerCase() === "admin";

  return (
    <div className="bg-white w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-sm font-bold text-gray-900 border-b border-gray-100">
              {isAdmin && (
                <th scope="col" className="py-6 pl-4 pr-3 w-12">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-0 cursor-pointer"
                    checked={selectAll}
                    onChange={onToggleSelectAll}
                  />
                </th>
              )}

              <th scope="col" className="py-6 px-4 text-center">
                Autor / Título
              </th>

              <th scope="col" className="py-6 px-4 text-center">
                Fecha de creación
              </th>

              <th scope="col" className="py-6 px-4 text-center">
                Editor
              </th>

              <th scope="col" className="py-6 px-4 text-center">
                Medio/Categoria
              </th>

              <th scope="col" className="py-6 px-4 text-center">
                {/* Espacio vacío para la columna de acciones */}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 text-gray-700 text-center">
            {testimonials.map((testimonial) => {
              const isSelected = selectedIds.includes(testimonial.id);

              return (
                <tr
                  key={testimonial.id}
                  className={`group transition-colors ${
                    isSelected ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                >
                  {isAdmin && (
                    <td className="py-6 pl-4 pr-3">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-400 text-gray-800 focus:ring-0 cursor-pointer"
                        checked={isSelected}
                        onChange={() => onToggleSelect(testimonial.id)}
                      />
                    </td>
                  )}

                  {/* Columna 1: Cliente / Curso (Combinados) */}
                  <td className="py-6 px-4">
                    <div className="text-sm font-medium text-gray-900">
                      {testimonial.author_name} / {testimonial.title}
                    </div>
                  </td>

                  {/* Columna 2: Fecha */}
                  <td className="py-6 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {testimonial.formattedDate}
                    </div>
                  </td>

                  {/* Columna 3: Editor */}
                  <td className="py-6 px-4 whitespace-nowrap">
                    <div className="text-base text-gray-700">
                      {testimonial.editor || "Sin editor"}
                    </div>
                  </td>

                  {/* Columna 4: Medio / Categoría (Texto simple, no badges) */}
                  <td className="py-6 px-4 whitespace-nowrap">
                    <div className="text-base text-gray-700 capitalize">
                      {testimonial.mediaType === "none"
                        ? "Texto"
                        : testimonial.mediaType}
                      <span className="mx-1 text-gray-400">/</span>
                      {testimonial.categoryName}
                    </div>
                  </td>

                  {/* Columna 5: Botón Detalles */}
                  <td className="py-6 px-4 text-right">
                    <Link
                      href={`/dashboard/testimonials/${testimonial.id}`}
                      className="inline-flex items-center justify-center px-6 py-2 rounded-full text-sm font-bold bg-[#FFF4E5] text-[#D97706] hover:bg-[#ffeccf] transition-colors"
                    >
                      Detalles
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
