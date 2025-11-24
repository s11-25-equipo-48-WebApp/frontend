'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/config';
import Link from 'next/link';

interface PendingTestimonial {
  id: string;
  client: string;
  course: string;
  receivedDate: string;
}

export default function PendingTestimonials() {
  const { data: pending, isLoading } = useQuery<PendingTestimonial[]>({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      const { data } = await api.get('/testimonials/pending');
      return data;
    },
  });

  // Mock data
  const mockPending: PendingTestimonial[] = [
    { id: '1', client: 'Juan P.', course: 'Python Avanzado', receivedDate: 'Jun 24, 2025' },
    { id: '2', client: 'Natan B.', course: 'Full Stack Pro', receivedDate: 'Mar 10, 2025' },
    { id: '3', client: 'Rodrigo G.', course: 'Python Principiante', receivedDate: 'Nov 10, 2025' },
    { id: '4', client: 'Orlando D.', course: 'Automatización con Shell', receivedDate: 'Dec 20, 2025' },
  ];

  const displayPending = pending || mockPending;

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-pink-500 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">Testimonios pendientes</h2>
          <span className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">
            {displayPending.length}
          </span>
        </div>
        <Link
          href="/dashboard/revisiones"
          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
        >
          Ver todo
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Cliente/Curso
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Recibido
              </th>
              <th className="text-right py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
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
            ) : (
              displayPending.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-800">{item.client}</p>
                    <p className="text-sm text-gray-500">{item.course}</p>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{item.receivedDate}</td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      href={`/dashboard/revisiones/${item.id}`}
                      className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors inline-block"
                    >
                      Ver detalles
                    </Link>
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