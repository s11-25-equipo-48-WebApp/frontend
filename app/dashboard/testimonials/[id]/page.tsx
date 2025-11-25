interface TestimonialProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Testimonials({ params }: TestimonialProps) {
  const { id } = await params; // ← Aquí desempaquetas la Promise

  const mockData: Record<string, { nombre: string; mensaje: string }> = {
    "1": { nombre: "Juan", mensaje: "Muy bueno." },
    "2": { nombre: "Ana", mensaje: "Excelente." },
  };

  const data = mockData[id] || {
    nombre: "Cargando...",
    mensaje: "Próximamente más testimonios",
  };

  return (
    <div>
      <h1>Detalles del testimonio</h1>
      <h2>Editor a cargo: {data.nombre}</h2>
      <p>
        <strong>{data.nombre}</strong>
      </p>
      <p>{data.mensaje}</p>
    </div>
  );
}
