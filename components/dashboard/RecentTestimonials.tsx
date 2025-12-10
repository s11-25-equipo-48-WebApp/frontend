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

      <div className="space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay testimonios publicados aún
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <Link
              key={testimonial.id}
              href={`/dashboard/testimonials/${testimonial.id}`}
              className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold shrink-0">
                {(testimonial.client ?? "T").charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">
                  {testimonial.client ?? "Sin nombre"}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  {testimonial.course ?? "Sin curso"}
                </p>
                <p className="text-sm text-gray-600">
                  {testimonial.content && testimonial.content.length > 90
                    ? testimonial.content.slice(0, 90) + "..."
                    : testimonial.content ?? "Sin contenido"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
