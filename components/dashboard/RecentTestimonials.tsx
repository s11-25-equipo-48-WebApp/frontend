"use client";
import Link from "next/link";
import Button from "../Button";
import { useRecentTestimonials } from "@/hooks/useRecentTestimonials";

export default function RecentTestimonials() {
  const { testimonials, isLoading } = useRecentTestimonials(5);

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Últimos testimonios publicados
        </h2>
        <Button variant="ghost">
          <Link
            href="/dashboard/testimonials/published"
            className="text-sm font-medium"
          >
            Ver todo
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden">
        {isLoading ? (
          // Skeleton loader en formato tabla
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 border-b pb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay testimonios publicados aún
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="text-sm font-bold text-gray-900 border-b border-gray-100">
                <tr>
                  <th scope="col" className="py-6 px-4 text-center">
                    Autor / Título
                  </th>
                  <th scope="col" className="py-6 px-4 text-center">
                    Contenido
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-center">
                {testimonials.map((testimonial) => (
                  <Link
                    href={`/dashboard/testimonials/${testimonial.id}`}
                    key={testimonial.id}
                  >
                    <tr className="hover:bg-gray-50 transition-colors group">
                      <td className="py-6 px-4 align-top">
                        <div
                          className="text-base text-gray-600 font-mono mt-1 truncate max-w-[120px] text-center mx-auto"
                          title={`${testimonial.author_name} / ${testimonial.title}`}
                        >
                          {testimonial.author_name} / {testimonial.title}
                        </div>
                      </td>
                      <td className="py-6 px-4 text-gray-600 align-top">
                        {testimonial.content.length > 100
                          ? `${testimonial.content.substring(0, 100)}...`
                          : testimonial.content}
                      </td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
