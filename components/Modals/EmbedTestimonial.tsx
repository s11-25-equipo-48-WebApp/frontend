'use client';
import React, { useState } from 'react';
import { X, Code, Copy, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/store/zustand';
import api from '@/services/config';
import Button from '@/components/Button';

interface EmbedTestimonialProps {
  isOpen: boolean;
  onClose: () => void;
  testimonialId: string;
}

const EmbedTestimonial: React.FC<EmbedTestimonialProps> = ({
  isOpen,
  onClose,
  testimonialId,
}) => {
  const [copied, setCopied] = useState(false);
  const [themeSelected, setThemeSelected] = useState<'light' | 'dark'>('light');
  const [widthSelected, setWidthSelected] = useState(600);
  const [heightSelected, setHeightSelected] = useState(400);
  const [autoPlay, setAutoPlay] = useState(false);
  const { currentOrganization } = useStore();

  const { data: embedCode, isPending, error, isRefetching, refetch } = useQuery({
    queryKey: ['testimonial-embed', testimonialId, currentOrganization],
    queryFn: async () => {
      const res = await api.get(`/public/embed/code/testimonio/${testimonialId}`, {
        params: {
          organizationId: currentOrganization,
          theme: themeSelected,
          width: widthSelected,
          height: heightSelected,
          autoplay: autoPlay,
        },
      });
      return res.data?.data || res.data;
    },
    enabled: !!currentOrganization && !!testimonialId && isOpen,
  });

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (embedCode) {
      try {
        await navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error al copiar:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#DBD1D5] dark:bg-card  border-2 border-[#633B48]  rounded-3xl shadow-2xl w-full max-w-3xl border border-foreground/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10">
          <div className="flex items-center gap-3">
            <div className="bg-winered/10 rounded-full p-2">
              <Code size={24} className="text-winered" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Código de Inserción
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
          >
            <X size={24} className="text-foreground/60" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {isPending ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-winered"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-center">
              Error al cargar el código de inserción
            </div>
          ) : (
            <>
              <div className='grid grid-cols-2 gap-6'>
                <label htmlFor="" className='flex flex-col'>
                  Tema:
                  <select value={themeSelected} onChange={(e) => setThemeSelected(e.target.value as 'light' | 'dark')} className="mb-4 p-2 border border-foreground/20 rounded-lg bg-card">
                    <option value="light">Tema Claro</option>
                    <option value="dark">Tema Oscuro</option>
                  </select>
                </label>
                <label htmlFor="" className='flex flex-col'>
                  Autoplay:
                  <select value={autoPlay.toString()} onChange={(e) => setAutoPlay(e.target.value === 'true')} className="p-2 border border-foreground/20 rounded-lg bg-card">
                    <option value="false">desactivado</option>
                    <option value="true">activado</option>
                  </select>
                  <i className='text-sm text-foreground/70'>
                    (solo para testimonios en video)
                  </i>

                </label>
                <label htmlFor="" className="flex flex-col">
                  Ancho:
                  <input
                    type="number"
                    value={widthSelected}
                    onChange={(e) => setWidthSelected(parseInt(e.target.value))}
                    className="mb-4 p-2 border border-foreground/20 rounded-lg bg-card"
                  />
                </label>
                <label htmlFor="" className='flex flex-col'>
                  Alto:
                  <input
                    type="number"
                    value={heightSelected}
                    onChange={(e) => setHeightSelected(parseInt(e.target.value))}
                    className="mb-4 p-2 border border-foreground/20 rounded-lg bg-card"
                  />
                </label>
              </div>

              <p className="text-foreground/70 mb-4">
                Copia y pega este código en tu sitio web para mostrar el testimonio:
              </p>

              <div className="relative">
                {isRefetching ? <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-winered"></div>
                </div> :
                  <pre className="bg-background border border-foreground/10 rounded-lg p-4 overflow-x-auto text-sm text-foreground font-mono max-h-96">
                    <code>{embedCode}</code>
                  </pre>
                }

                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 bg-card cursor-pointer border border-foreground/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={18} className="text-green-500" />
                      <span className="text-sm text-green-500">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} className="text-foreground/60" />
                      <span className="text-sm text-foreground/60">Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-4 px-6 py-4 border-t border-foreground/10">
          <Button variant="ghost" onClick={() => {
            refetch();
          }}>
            Volver a generar
          </Button>

          <Button
            variant="action"
            color="default"
            onClick={handleCopy}
            disabled={isPending || !!error}
          >
            <Copy size={18} />
            Copiar Código
          </Button>
        </div>
      </div>
    </div >
  );
};

export default EmbedTestimonial;
