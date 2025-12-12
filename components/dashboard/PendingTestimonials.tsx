"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Button from "../Button";
import { usePendingTestimonialsWidget } from "@/hooks/usePendingTestimonialsWidget";
import { useStore } from "@/store/zustand";

export default function PendingTestimonials() {
  const { data: session } = useSession();
  const { currentOrganization } = useStore();
  const { testimonials, count, isLoading } = usePendingTestimonialsWidget(4);

  const currentOrgRole = session?.user?.organizations
    ?.find((org) => org.id === currentOrganization)
    ?.role?.toLowerCase();

  const isAdmin = currentOrgRole === "admin";

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-pink-500 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">
            Testimonios pendientes
          </h2>
          {!isLoading && (
            <span className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">
              {count}
            </span>
          )}
        </div>
        <Button variant="ghost" className="p-0">
          <Link
            href="/dashboard/testimonials/pending-reviews"
            className="text-sm font-medium"
          >
            Ver todo
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse text-center">
          <thead className="text-sm font-bold text-gray-900 border-b border-gray-100">
            <tr>
              <th scope="col" className="py-6 px-4 text-center">
                Autor / Título
              </th>
              <th scope="col" className="py-6 px-4 text-center">
                Fecha de creación
              </th>
              <th className="text-right py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 animate-pulse"
                  >
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-8 bg-gray-200 rounded w-24 ml-auto" />
                    </td>
                  </tr>
                ))}
              </>
            ) : testimonials.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500">
                  {isAdmin
                    ? "No hay testimonios pendientes de revisión"
                    : "No tienes testimonios pendientes"}
                </td>
              </tr>
            ) : (
              testimonials.map((testimonial) => (
                <tr
                  key={testimonial.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-6 px-4 whitespace-nowrap">
                    <p className="text-base text-gray-700">
                      {testimonial.author_name} / {testimonial.title}
                    </p>
                  </td>
                  <td className="py-6 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {testimonial.formattedDate}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Button variant="action" color="orange" className="ml-auto">
                      <Link
                        href={`/dashboard/testimonials/${testimonial.id}`}
                        className="text-sm font-medium"
                      >
                        Ver detalles
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
