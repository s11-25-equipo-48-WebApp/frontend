import { Testimonial } from "@/services/testimonial.service";
import Link from "next/link";

interface AllTestimonialsTableProps {
  testimonials: Testimonial[];
}

export default function AllTestimonialsTable({
  testimonials,
}: AllTestimonialsTableProps) {
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'aprobado':
        return 'bg-green-100 text-green-700';
      case 'rechazado':
        return 'bg-red-100 text-red-700';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'aprobado':
        return 'Aprobado';
      case 'rechazado':
        return 'Rechazado';
      case 'pendiente':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="bg-white w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse text-center">
          <thead>
            <tr className="text-sm font-bold text-gray-900 border-b border-gray-100">
              {/* Columna de Estado */}
              <th scope="col" className="py-6 pl-4 pr-3 text-center w-32">
                Estado
              </th>

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
                Medio/Categoría
              </th>

              <th scope="col" className="py-6 px-4 text-center">
                {/* Espacio vacío para la columna de acciones */}
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-50 text-gray-700 text-center">
            {testimonials.map((testimonial) => {
              return (
                <tr
                  key={testimonial.id}
                  className="group transition-colors hover:bg-gray-50"
                >
                  {/* Columna de Estado */}
                  <td className="py-6 pl-4 pr-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        testimonial.status
                      )}`}
                    >
                      {getStatusLabel(testimonial.status)}
                    </span>
                  </td>

                  {/* Columna: Autor / Título */}
                  <td className="py-6 px-4">
                    <div className="text-sm font-medium text-gray-900">
                      {testimonial.author_name} / {testimonial.title}
                    </div>
                  </td>

                  {/* Columna: Fecha */}
                  <td className="py-6 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {testimonial.formattedDate}
                    </div>
                  </td>

                  {/* Columna: Editor */}
                  <td className="py-6 px-4 whitespace-nowrap">
                    <div className="text-base text-gray-700">
                      {testimonial.editor || "Sin editor"}
                    </div>
                  </td>

                  {/* Columna: Medio / Categoría */}
                  <td className="py-6 px-4 whitespace-nowrap">
                    <div className="text-base text-gray-700 capitalize">
                      {testimonial.mediaType === "none" ? "Texto" : testimonial.mediaType}
                      <span className="mx-1 text-gray-400">/</span>
                      {testimonial.categoryName}
                    </div>
                  </td>

                  {/* Columna: Botón Detalles */}
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