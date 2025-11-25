import { useQuery } from "@tanstack/react-query";
import api from "@/services/config";
import Link from "next/link";
import Button from "../Button";

interface Testimonial {
  id: string;
  name: string;
  email: string;
  review: string;
  role: string;
  image: string;
  urlVideo: string;
  content: string;
  createdAt: string;
}

export default function RecentTestimonials() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["recent-testimonials"],
    queryFn: async () => {
      const { data } = await api.get("/testimonials/recent");
      return data;
    },
  });

  // Mock data para desarrollo
  const mockTestimonials: Testimonial[] = [
    {
      id: "1",
      name: "Ana P. S.",
      email: "ana.perez@example.com",
      review: "positive",
      role: "Full Stack Pro",
      image: "@/public/girlExample.jpg",
      urlVideo: "https://www.youtube.com/",
      content:
        "¡He conseguido el puesto de Junior con el que soñaba! El curso me preparó perfectamente para las entrevistas técnicas y los proyectos prácticos fueron clave para mi portfolio.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Rafael G. F.",
      email: "rafael.gomez@example.com",
      review: "positive",
      role: "Python Avanzado",
      image: "@/public/girlExample.jpg",
      urlVideo: "https://www.youtube.com/",
      content:
        "Explicación impecable de las estructuras de datos avanzadas. Los ejercicios de algoritmos me ayudaron a mejorar mi lógica de programación. Totalmente recomendado para quienes quieren profundizar en Python.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Lucas F. B.",
      email: "lucas.fernandez@example.com",
      review: "negative",
      role: "Full Stack Pro",
      image: "@/public/girlExample.jpg",
      urlVideo: "https://www.youtube.com/",
      content:
        "Finalmente lo entendí y estoy muy contenta de haberme inscrito. Sin embargo, algunas secciones podrían tener más ejemplos prácticos. El contenido es bueno pero esperaba más proyectos reales.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Mariana V. L.",
      email: "mariana.vega@example.com",
      review: "positive",
      role: "Automatización con Shell",
      image: "@/public/girlExample.jpg",
      urlVideo: "https://www.youtube.com/",
      content:
        "Implementé la automatización y ahorré más de 10 horas semanales en tareas repetitivas. Los scripts que aprendí a crear son ahora parte esencial de mi flujo de trabajo diario. Excelente inversión de tiempo.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      name: "María R.",
      email: "maria.rodriguez@example.com",
      review: "positive",
      role: "Python Avanzado",
      image: "@/public/girlExample.jpg",
      urlVideo: "https://www.youtube.com/",
      content:
        "Participar en este curso fue muy provechoso. Los conceptos de programación orientada a objetos y decoradores quedaron super claros. El instructor responde rápido las dudas y la comunidad es muy activa.",
      createdAt: new Date().toISOString(),
    },
  ];

  const displayTestimonials = testimonials || mockTestimonials;

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Últimos testimonios publicados
        </h2>
        <Button variant="ghost">
          <Link href="/dashboard/testimonios" className="text-sm font-medium">
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
        ) : (
          displayTestimonials.map((testimonial) => (
            <Link
              key={testimonial.id}
              href={`/dashboard/testimonials/${testimonial.id}`}
              className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold flex-shrink-0">
                {testimonial.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-500 mb-1">{testimonial.role}</p>
                <p className="text-sm text-gray-600 truncate">
                  {testimonial.content}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
