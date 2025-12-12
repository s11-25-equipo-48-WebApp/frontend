'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTestimonialById } from '@/hooks/useTestimonialById';
import TestimonialContent from '@/components/dashboard/testimonials/TestimonialContent';
import { useStore } from '@/store/zustand';
import { useQueryClient } from '@tanstack/react-query';
import { testimonialService } from '@/services/testimonial.service';
import { toast } from 'react-toastify';
import { CopyX } from 'lucide-react';
import { useAnalyticsServices } from '@/services/analytics.services';

interface TestimonialProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Testimonials({ params }: TestimonialProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [paramsState, setParamsState] = useState<string | null>(null);
  // currentOrganization es el ID (string | null)
  const organizationIdFromStore = useStore((s) => s.currentOrganization);
  const role = useStore((s) => s.role);
  const queryClient = useQueryClient();

  // Manejo de params asincrónico
  useEffect(() => {
    params.then((p) => setParamsState(p.id));
  }, [params]);

  const { testimonial, isLoading, error } = useTestimonialById(
    paramsState || ''
  );

  const accessToken = session?.user?.accessToken || '';
  const organizationId = organizationIdFromStore || '';

  // Determinar si el usuario es Admin
  const isAdmin = role === 'admin';

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const analyticsServices = useAnalyticsServices();
  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center space-y-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winered"></div>
        <h1 className="text-2xl font-bold mb-4">Cargando Testimonio...</h1>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className="p-6 flex flex-col items-center justify-center space-y-6">
        <h1 className="text-2xl font-bold mb-4">Testimonio no encontrado</h1>
        <p className="text-gray-500">
          El testimonio con ID {paramsState} no existe.
        </p>
        <CopyX className="text-winered" size={68} />
      </div>
    );
  }

  const handleApprove = async () => {
    if (!organizationId || !accessToken || !testimonial?.id) {
      toast.error('Falta organización o token para aprobar.');
      return;
    }
    try {
      setIsApproving(true);
      await testimonialService.updateStatus(
        organizationId,
        testimonial.id,
        accessToken,
        'aprobado'
      );
      await analyticsServices.createEvent({
        metadata: {
          event_type: 'approval',
          testimonio_id: testimonial.id,
        },
      });
      queryClient.invalidateQueries({ queryKey: ['testimonial', paramsState] });
      toast.success('Testimonio aprobado');
      // Redirigir a dashboard y hacer reload
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error al aprobar:', error);
      toast.error('Error al aprobar el testimonio');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!organizationId || !accessToken || !testimonial?.id) {
      toast.error('Falta organización o token para rechazar.');
      return;
    }
    try {
      setIsRejecting(true);
      await testimonialService.updateStatus(
        organizationId,
        testimonial.id,
        accessToken,
        'rechazado'
      );
      queryClient.invalidateQueries({ queryKey: ['testimonial', paramsState] });
      toast.success('Testimonio rechazado');
      // Redirigir a dashboard y hacer reload
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error al rechazar:', error);
      toast.error('Error al rechazar el testimonio');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleSaveChanges = async (newBody: string) => {
    if (!organizationId || !accessToken || !testimonial?.id) {
      toast.error('Falta organización o token para guardar.');
      return;
    }
    try {
      setIsSaving(true);
      await testimonialService.update(
        organizationId,
        testimonial.id,
        accessToken,
        { body: newBody }
      );
      queryClient.invalidateQueries({ queryKey: ['testimonial', paramsState] });
      toast.success('Cambios guardados');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TestimonialContent
      testimonial={testimonial}
      isAdmin={isAdmin}
      onApprove={handleApprove}
      onReject={handleReject}
      onSaveChanges={handleSaveChanges}
      approving={isApproving}
      rejecting={isRejecting}
      saving={isSaving}
    />
  );
};
