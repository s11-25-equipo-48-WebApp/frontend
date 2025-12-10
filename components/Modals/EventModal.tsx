import { useAnalyticsServices } from '@/services/analytics.services';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import React from 'react';

export default function EventModal({ id, onClose }: { id: string, onClose: () => void; }) {
  const { getEventDetails } = useAnalyticsServices();
  const { data: eventDetails, isPending, error } = useQuery({
    queryKey: ['event-details', id],
    queryFn: () => getEventDetails({ eventId: id }),
    enabled: !!id,
  });
  if (error) {
    return <div>Error loading event details.</div>;
  }
  console.log(eventDetails);

  return (
    <div className='fixed inset-0 bg-black/30 flex justify-center items-center' onClick={onClose}>
      <div className='w-full md:w-2/3   border-2 border-[#633B48] h-2/3 rounded-lg bg-[#DBD1D5] dark:bg-card z-10 shadow-lg animate-in slide-in-from-bottom' onClick={(e) => e.stopPropagation()}>
        {isPending ? (
          <div className='flex justify-center items-center h-full'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className='flex justify-end p-2'>
              <button onClick={onClose}>
                <X size={30} className=" cursor-pointer" />
              </button>
            </div>
            <div className='overflow-y-auto h-[80%] divide-y'>
              <div className='px-6 pb-4'>
                <h2 className='text-2xl font-bold mb-4'>Detalles del evento</h2>
                <div className='flex gap-2'>
                  <b>Titulo del testimonio:</b>
                  <p>{eventDetails.titulo_testimonio}</p>
                </div>
                <div className='flex gap-2'>
                  <b>Tipo de evento:</b>
                  <p>{eventDetails.tipo_evento}</p>
                </div>
              </div>
              <div className='flex justify-around p-6 gap-5 flex-wrap'>
                <div className='flex flex-col justify-center items-center'>
                  <b>fecha y hora</b>
                  <p className='p-2 border-4 border-white w-fit rounded-lg text-center mt-3'>   {new Date(eventDetails.fecha_hora).toLocaleString('es-ES', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ' ')}</p>
                </div>
                <div className='flex flex-col justify-center items-center'>
                  <b>IP</b>
                  <p className='p-2 border-4 border-white w-fit rounded-lg text-center mt-3'>{eventDetails.ip}</p>
                </div>
                <div className='flex flex-col justify-center items-center'>
                  <b>refferer</b>
                  <p className='p-2 border-4 border-white w-fit text-center rounded-lg mt-3'>{eventDetails.referrer || 'N/A'}</p>
                </div>
              </div>
              <div className='p-6'>
                <div className=''>
                  <b>User Agent</b>
                  <p className='p-2 border-4 border-white w-fit text-center rounded-lg mt-3'>{eventDetails.user_agent}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
