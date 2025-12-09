"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTestimonialById } from "@/hooks/useTestimonialById";
import TestimonialContent from "@/components/dashboard/testimonials/TestimonialContent";

interface TestimonialProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Testimonials({ params }: TestimonialProps) {
  const { data: session } = useSession();
  const [paramsState, setParamsState] = useState<string | null>(null);

  // Manejo de params asincrónico
  useEffect(() => {
    params.then((p) => setParamsState(p.id));
  }, [params]);

  const { testimonial, isLoading, error } = useTestimonialById(
    paramsState || ""
  );

  // Determinar si el usuario es Admin
  const isAdmin =
    (session?.user?.role === "admin" ||
      session?.user?.organizations?.some((org) => org.role === "admin")) ??
    false;

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Cargando...</h1>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Testimonio no encontrado</h1>
        <p>El testimonio con ID {paramsState} no existe.</p>
      </div>
    );
  }

  const handleApprove = () => {
    console.log("Testimonio aprobado:", testimonial.id);
    // TODO: Implementar lógica de aprobación
  };

  const handleReject = () => {
    console.log("Testimonio rechazado:", testimonial.id);
    // TODO: Implementar lógica de rechazo
  };

  const handleSaveChanges = () => {
    console.log("Cambios guardados:", testimonial.id);
    // TODO: Implementar lógica de guardado
  };

  return (
    <TestimonialContent
      testimonial={testimonial}
      isAdmin={isAdmin}
      onApprove={handleApprove}
      onReject={handleReject}
      onSaveChanges={handleSaveChanges}
    />
  );
}
