'use client';
import { useState } from 'react';
import { useStore, TestimonyDraft } from '@/store/zustand';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { RiTextWrap, RiVideoLine, RiImageLine, RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

export default function LibraryPage() {
    const { drafts, deleteDraft } = useStore();
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setDeletingId(id);
        deleteDraft(id);
        toast.success('Borrador eliminado');
        setDeletingId(null);
    };

    const handleLoad = (draft: TestimonyDraft) => {
        // Guardar el borrador seleccionado en sessionStorage para cargarlo en el formulario
        sessionStorage.setItem('loadDraft', JSON.stringify(draft));
        router.push('/dashboard/testimonials/create');
        toast.info('Cargando borrador...');
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getMediaIcon = (mediaType: string) => {
        switch (mediaType) {
            case 'video':
                return <RiVideoLine className="w-6 h-6 text-purple-500" />;
            case 'image':
                return <RiImageLine className="w-6 h-6 text-pink-500" />;
            default:
                return <RiTextWrap className="w-6 h-6 text-teal-500" />;
        }
    };

    const getMediaBadge = (mediaType: string) => {
        switch (mediaType) {
            case 'video':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
            case 'image':
                return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
            default:
                return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Biblioteca Multimedia</h1>
                <p className="text-foreground/60 mt-1">
                    Gestiona tus borradores de testimonios guardados
                </p>
            </div>

            {/* Drafts Grid */}
            {drafts.length === 0 ? (
                <div className="border border-foreground/10 rounded-2xl shadow-sm p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            No hay borradores guardados
                        </h3>
                        <p className="text-foreground/60 mb-6">
                            Los testimonios que guardes como borrador aparecerán aquí
                        </p>
                        <Button
                            variant="action"
                            color="green"
                            onClick={() => router.push('/dashboard/testimonials/create')}
                        >
                            Crear Testimonio
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drafts.map((draft) => (
                        <div
                            key={draft.id}
                            className="border border-foreground/10 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow bg-background"
                        >
                            {/* Header con icono de tipo de medio */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {getMediaIcon(draft.mediaType)}
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getMediaBadge(draft.mediaType)}`}>
                                        {draft.mediaType === 'video' ? 'Video' : draft.mediaType === 'image' ? 'Imagen' : 'Texto'}
                                    </span>
                                </div>
                            </div>

                            {/* Título */}
                            <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                                {draft.title || 'Sin título'}
                            </h3>

                            {/* Cuerpo */}
                            <p className="text-sm text-foreground/60 mb-4 line-clamp-3">
                                {draft.body || 'Sin contenido'}
                            </p>

                            {/* Metadata */}
                            <div className="space-y-2 mb-4 text-xs text-foreground/50">
                                {draft.author && (
                                    <p>
                                        <span className="font-semibold">Autor:</span> {draft.author}
                                    </p>
                                )}
                                {draft.email && (
                                    <p>
                                        <span className="font-semibold">Email:</span> {draft.email}
                                    </p>
                                )}
                                <p>
                                    <span className="font-semibold">Guardado:</span> {formatDate(draft.savedAt)}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-foreground/10">
                                <Button
                                    variant="action"
                                    color="green"
                                    onClick={() => handleLoad(draft)}
                                    className="flex-1"
                                >
                                    Cargar
                                </Button>
                                <Button
                                    variant="action"
                                    color="red"
                                    onClick={() => handleDelete(draft.id)}
                                    isLoading={deletingId === draft.id}
                                    className="px-4"
                                >
                                    <RiDeleteBin6Line className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info Card */}
            {drafts.length > 0 && (
                <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Consejos sobre borradores
                    </h3>
                    <ul className="space-y-2 text-sm text-foreground/70">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Los borradores se guardan automáticamente en tu navegador</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Puedes cargar un borrador para continuar editándolo</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Los archivos multimedia se guardan junto con el borrador</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
