export interface Testimonial {
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

export const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ana P. S.",
    email: "ana.perez@example.com",
    review: "positive",
    role: "Full Stack Pro",
    image: "/girlExample.jpg",
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
    image: "/girlExample.jpg",
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
    image: "/girlExample.jpg",
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
    image: "/girlExample.jpg",
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
    image: "/girlExample.jpg",
    urlVideo: "https://www.youtube.com/",
    content:
      "Participar en este curso fue muy provechoso. Los conceptos de programación orientada a objetos y decoradores quedaron super claros. El instructor responde rápido las dudas y la comunidad es muy activa.",
    createdAt: new Date().toISOString(),
  },
];
