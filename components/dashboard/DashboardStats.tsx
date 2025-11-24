'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/config';
import { ArrowUpRight } from 'lucide-react';

interface Stats {
  publishedMonth: number;
  receivedMonth: number;
  approvalRate: number;
  consentRate: number;
  mediumImpact: number;
}

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data;
    },
  });

  const cards = [
    {
      title: 'Testimonios publicados (mes)',
      value: stats?.publishedMonth || 90,
      color: 'bg-green-500',
      link: '/dashboard/testimonios/publicados',
    },
    {
      title: 'Testimonios recibidos (mes)',
      value: stats?.receivedMonth || 128,
      color: 'bg-blue-500',
      link: '/dashboard/testimonios/recibidos',
    },
    {
      title: 'Tasa de aprobación',
      value: `${stats?.approvalRate || 89}%`,
      color: 'bg-orange-500',
      link: '/dashboard/analytics/aprobacion',
    },
    {
      title: 'Tasa de consentimiento',
      value: `${stats?.consentRate || 92}%`,
      color: 'bg-purple-500',
      link: '/dashboard/analytics/consentimiento',
    },
    {
      title: 'Impacto medio',
      value: stats?.mediumImpact || 234,
      color: 'bg-gray-800',
      link: '/dashboard/analytics/impacto',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative overflow-hidden group`}
        >
          <div className="relative z-10">
            <h3 className="text-sm font-medium mb-2 opacity-90">{card.title}</h3>
            <p className="text-3xl font-bold mb-4">{card.value}</p>
            <button className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        </div>
      ))}
    </div>
  );
}