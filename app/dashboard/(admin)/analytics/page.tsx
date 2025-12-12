'use client';
import { useState } from 'react';
import { ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/Button';
import { useQuery } from '@tanstack/react-query';
import { useAnalyticsServices } from '@/services/analytics.services';
import { useStore } from '@/store/zustand';
import { analyticsEvent } from '@/models/analytics.models';
import EventModal from '@/components/Modals/EventModal';
export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<{
    start_date: string;
    end_date: string;
  }>({ start_date: '', end_date: '' });
  const [viewDetailsModal, setViewDetailsModal] = useState<{
    id: string | null;
  }>({ id: null });
  const [dateRangeLabel, setDateRangeLabel] = useState('Sin filtro');
  const [eventType, setEventType] = useState<
    | 'view'
    | 'submission'
    | 'approval'
    | 'rejection'
    | 'consent_given'
    | 'consent_revoked'
    | ''
  >('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { currentOrganization } = useStore();
  const analyticsServices = useAnalyticsServices();
  const calculateDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
    };
  };

  const formatDateRangeLabel = (start: string, end: string) => {
    if (!start || !end) return 'Sin filtro';
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    })} - ${endDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    })}`;
  };

  const dateRangeOptions = [
    { label: 'Sin filtro', value: { start_date: '', end_date: '' } },
    { label: 'Últimos 7 días', value: calculateDateRange(7) },
    { label: 'Últimos 30 días', value: calculateDateRange(30) },
    { label: 'Últimos 90 días', value: calculateDateRange(90) },
  ];

  const handleDateRangeSelect = (range: {
    start_date: string;
    end_date: string;
  }) => {
    setDateRange(range);
    setDateRangeLabel(formatDateRangeLabel(range.start_date, range.end_date));
  };

  const eventTypeOptions = [
    { value: 'view', label: 'Vista' },
    { value: 'submission', label: 'Envío' },
    { value: 'approval', label: 'Aprobación' },
    { value: 'rejection', label: 'Rechazo' },
  ];

  const {
    data: analyticsData,
    isPending,
    error,
  } = useQuery({
    queryKey: [
      'analyticsData',
      dateRange,
      eventType,
      searchQuery,
      currentPage,
      limit,
    ],
    queryFn: async () => {
      const response = await analyticsServices.getOrganizationAnalytics({
        filters: {
          start_date: dateRange.start_date || undefined,
          end_date: dateRange.end_date || undefined,
          event_type: eventType || undefined,
          search: searchQuery || undefined,
          page: currentPage,
          limit: limit,
        },
      });
      return response;
    },
    enabled: !!currentOrganization,
  });
  const totalEvents = analyticsData?.data?.length || 0;
  const percentOfApproval =
    !isPending && analyticsData?.data
      ? (analyticsData.data.filter(
        (item: analyticsEvent) => item.tipo_evento === 'approval'
      ).length /
        analyticsData.data.length) *
      100
      : 0;

  const TestimonialsReceived =
    !isPending && analyticsData?.data
      ? analyticsData.data.filter(
        (item: analyticsEvent) => item.tipo_evento === 'submission'
      ).length
      : 0;

  const TestimonialsViews =
    !isPending && analyticsData?.data
      ? analyticsData.data.filter(
        (item: analyticsEvent) => item.tipo_evento === 'view'
      ).length
      : 0;

  const stats = [
    {
      label: 'Testimonios publicados',
      value: totalEvents,
      color: 'from-green-400 to-green-600',
    },
    {
      label: 'Testimonios recibidos',
      value: TestimonialsReceived,
      color: 'from-blue-400 to-blue-600',
    },
    {
      label: 'Tasa de aprobación',
      value: `${(percentOfApproval ?? 0).toFixed(2)}%`,
      color: 'from-orange-400 to-orange-600',
    },
    {
      label: 'Visualizaciones',
      value: TestimonialsViews,
      color: 'from-slate-700 to-slate-900',
    },
  ];
  return (
    <div className="">
      <div className="max-w-7xl mx-auto gap-6 flex flex-col ">
        <div className="flex flex-col ">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-foreground/10 rounded-lg hover:border-winered/50 cursor-pointer transition-colors group relative">
              <span className="text-foreground">{dateRangeLabel}</span>
              <ChevronDown className="w-4 h-4 text-foreground/60" />

              <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-foreground/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {dateRangeOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateRangeSelect(option.value)}
                    className={`w-full text-left px-4 py-3 hover:bg-background transition-colors ${dateRange.start_date === option.value.start_date &&
                      dateRange.end_date === option.value.end_date
                      ? 'text-winered font-semibold'
                      : 'text-foreground'
                      } ${index === 0 ? 'rounded-t-lg' : ''} ${index === dateRangeOptions.length - 1
                        ? 'rounded-b-lg'
                        : ''
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Type */}
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-foreground/10 rounded-lg hover:border-winered/50 cursor-pointer transition-colors group relative">
              <span className="text-foreground">
                {eventType
                  ? eventTypeOptions.find((opt) => opt.value === eventType)
                    ?.label
                  : 'Tipo de evento'}
              </span>
              <ChevronDown className="w-4 h-4 text-foreground/60" />

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-foreground/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => setEventType('')}
                  className={`w-full text-left px-4 py-3 hover:bg-background transition-colors first:rounded-t-lg ${eventType === ''
                    ? 'text-winered font-semibold'
                    : 'text-foreground'
                    }`}
                >
                  Todos los eventos
                </button>
                {eventTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setEventType(option.value as string as typeof eventType)
                    }
                    className={`w-full text-left px-4 py-3 hover:bg-background transition-colors ${eventType === option.value
                      ? 'text-winered font-semibold'
                      : 'text-foreground'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-64 flex items-center gap-2 px-4 py-2 bg-card border border-foreground/10 rounded-lg hover:border-winered/50 transition-colors">
              <input
                type="text"
                placeholder="Buscar testimonio"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground placeholder-foreground/50"
              />
              <Search className="w-4 h-4 text-foreground/60" />
            </div>

            {/* Filter Button */}
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-foreground/10 rounded-lg hover:border-winered/50 cursor-pointer transition-colors group relative">
              <span className="text-foreground">Mostrar: {limit}</span>
              <ChevronDown className="w-4 h-4 text-foreground/60" />

              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-32 bg-card border border-foreground/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {[5, 10, 20, 50].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setLimit(value);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-background transition-colors ${limit === value
                      ? 'text-winered font-semibold'
                      : 'text-foreground'
                      } ${value === 10 ? 'rounded-t-lg' : ''} ${value === 100 ? 'rounded-b-lg' : ''
                      }`}
                  >
                    {value} items
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData && stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl text-white shadow-lg`}
            >
              <div className="text-sm font-medium opacity-90 mb-2">
                {stat.label}
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
        {isPending && !error ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winered"></div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-foreground/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th className="text-left px-6 py-4 font-semibold text-foreground">
                      ID del evento
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-foreground">
                      Testimonio
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-foreground">
                      Tipo de evento
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-foreground">
                      Fecha/Hora
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {!error &&
                    analyticsData?.data &&
                    analyticsData.data.length > 0 ? (
                    analyticsData.data.map(
                      (item: analyticsEvent, index: number) => (
                        <tr
                          key={index}
                          className="border-b border-foreground/5 hover:bg-background/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-foreground/70 text-nowrap ">
                            {item.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="px-4 py-2 border border-foreground/10 rounded-lg text-foreground/70 inline-block">
                              {item.testimonio}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="px-4 py-2 border border-foreground/10 rounded-lg text-foreground/70 inline-block">
                              {item.tipo_evento}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="px-4 py-2 border border-foreground/10 rounded-lg text-foreground/70 inline-block">
                              {new Date(item.fecha_hora)
                                .toLocaleString('es-ES', {
                                  hour12: false,
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                                .replace(',', ' ')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="ghost"
                              onClick={() =>
                                setViewDetailsModal({ id: item.id })
                              }
                              className="px-4 py-2 text-sm"
                            >
                              Detalles
                            </Button>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-foreground/70"
                      >
                        No se encontraron eventos que coincidan con los filtros
                        aplicados o no hay eventos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 px-6 py-6 border-t border-foreground/10">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>

              <div className="flex items-center gap-2">
                {analyticsData?.meta && (
                  <>
                    {/* Generate page numbers dynamically */}
                    {Array.from(
                      { length: analyticsData.meta.totalPages },
                      (_, i) => i + 1
                    ).map((page) => {
                      // Show first page, last page, current page and neighbors
                      const totalPages = analyticsData.meta.totalPages;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg font-semibold transition-colors ${currentPage === page
                              ? 'bg-winered text-white'
                              : 'border border-foreground/10 text-foreground/60 hover:bg-background'
                              }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        (page === 2 && currentPage > 4) ||
                        (page === totalPages - 1 &&
                          currentPage < totalPages - 3)
                      ) {
                        return (
                          <span key={page} className="text-foreground/60">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      analyticsData?.meta?.totalPages || 1,
                      currentPage + 1
                    )
                  )
                }
                disabled={
                  currentPage === (analyticsData?.meta?.totalPages || 1)
                }
                className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* View Details Modal */}
      {viewDetailsModal.id && (
        <EventModal
          id={viewDetailsModal.id}
          onClose={() => setViewDetailsModal({ id: null })}
        />
      )}
    </div>
  );
}
