'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import {
  MessageSquare,
  Video,
  Users,
  Shield,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: MessageSquare,
      title: 'Testimonios Educativos',
      description: 'Captura experiencias de estudiantes, padres y docentes en texto, video o imagen.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Video,
      title: 'Videos de Impacto',
      description: 'Graba y muestra historias de éxito educativo que inspiran confianza.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Users,
      title: 'Gestión Colaborativa',
      description: 'Tu equipo educativo trabajando junto en la recolección y moderación.',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Métricas de Impacto',
      description: 'Visualiza el alcance y efectividad de tus testimonios educativos.',
      color: 'from-orange-500 to-amber-500',
    },
  ];

  const benefits = [
    { text: 'Aumenta la confianza de padres y estudiantes', icon: Shield },
    { text: 'Mejora las tasas de matriculación', icon: Zap },
    { text: 'Gestión centralizada y organizada', icon: CheckCircle2 },
    { text: 'Colaboración entre docentes y staff', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-card/80 backdrop-blur-md border-b border-foreground/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-winered dark:text-yellow cursor-pointer" onClick={() => router.push('/')}>
            Sayso
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="wineAlt"
              size='fit'
              onClick={() => router.push('/auth/login')}
              className="text-sm"
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="wine"
              onClick={() => router.push('/auth/register')}
              size='fit'
              className="text-sm"
            >
              Comenzar Gratis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-btn-warning" />
              <span className="text-sm font-medium text-foreground">La confianza que tu institución necesita</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
              Testimonios que impulsan el aprendizaje
            </h1>

            <p className="text-xl md:text-2xl text-foreground/70 mb-10 leading-relaxed">
              Recolecta y gestiona testimonios de estudiantes, padres y docentes que <span className="font-semibold text-foreground">validan tu propuesta educativa</span> y <span className="font-semibold text-foreground">atraen nuevos alumnos</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                variant="wine"
                size='fit'
                onClick={() => router.push('/auth/register')}
                className="group text-lg px-10 py-4"
              >
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-10 py-4"
              >
                Ver Funcionalidades
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-foreground/10">
              <div>
                <div className="text-3xl font-bold text-winered dark:text-yellow">10K+</div>
                <div className="text-sm text-foreground/60 mt-1">Testimonios</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-winered dark:text-yellow">200+</div>
                <div className="text-sm text-foreground/60 mt-1">Instituciones</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-winered dark:text-yellow">95%</div>
                <div className="text-sm text-foreground/60 mt-1">Tasa de Conversión</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Herramientas potentes y fáciles de usar para gestionar testimonios profesionalmente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl border-2 transition-all cursor-pointer ${activeFeature === index
                    ? 'border-winered bg-yellow/10 shadow-lg scale-105'
                    : 'border-foreground/10 hover:border-winered/50 hover:shadow-md bg-background'
                    }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="w-12 h-12 rounded-xl bg-winered flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-beige dark:bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                ¿Por qué Sayso para EdTech?
              </h2>
              <p className="text-xl text-foreground/70 mb-8">
                La forma más efectiva de demostrar el impacto educativo con las voces de estudiantes, padres y educadores que han vivido la experiencia.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-lg bg-winered flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg font-medium text-foreground">{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-winered p-1">
                <div className="w-full h-full bg-background rounded-3xl p-8 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-24 h-24 text-foreground/20 mx-auto mb-6" />
                    <div className="space-y-4">
                      <div className="h-4 bg-foreground/10 rounded-full w-3/4 mx-auto"></div>
                      <div className="h-4 bg-foreground/10 rounded-full w-full"></div>
                      <div className="h-4 bg-foreground/10 rounded-full w-5/6 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-2xl rotate-12 opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-teal-400 rounded-full opacity-80 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-winered rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Impulsa tu institución educativa hoy
              </h2>
              <p className="text-xl mb-8 text-white/80">
                Únete a instituciones educativas que ya confían en Sayso
              </p>
              <Button
                variant="action"
                size='full'
                color="yellow"
                onClick={() => router.push('/auth/register')}
                className="text-winered px-10 py-4 text-lg font-semibold"
              >
                Crear Cuenta Gratis
              </Button>
              <p className="text-sm text-white/70 mt-4">
                No requiere tarjeta de crédito • Configuración en 2 minutos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-foreground/10 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold text-winered dark:text-yellow">
                Sayso
              </span>
              <span className="text-foreground/70">© 2025 Sayso. Todos los derechos reservados.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-foreground/70 hover:text-winered transition-colors">Términos</a>
              <a href="#" className="text-foreground/70 hover:text-winered transition-colors">Privacidad</a>
              <a href="#" className="text-foreground/70 hover:text-winered transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
