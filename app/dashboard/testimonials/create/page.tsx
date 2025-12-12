'use client';
import { useState, useMemo, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/services/config';
import InputForm from '@/components/InputForm';
import SelectForm from '@/components/SelectForm';
import FileUpload from '@/components/FileUpload';
import Button from '@/components/Button';
import { RiTextWrap, RiVideoLine, RiImageLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { handleUpload } from '@/hooks/useApiYoutube';
import { uploadToCloudinary } from '@/hooks/useCloudinary';
import { useCategories } from '@/hooks/useCategories';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/zustand';
import { useAnalyticsServices } from '@/services/analytics.services';

type MediaType = 'none' | 'video' | 'image';

interface TestimonyFormData {
    title: string;
    body: string;
    category_id: string;
    email: string;
    author?: string;
    tags?: string[];
}

export default function CreateTestimonyPage() {
    const router = useRouter();
    const [mediaType, setMediaType] = useState<MediaType>('none');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loadedDraftId, setLoadedDraftId] = useState<string | null>(null);
    const { currentOrganization } = useStore();
    const { data: session } = useSession();
    const analyticsServices = useAnalyticsServices();
    // Obtener categorías desde la API
    const { data: categories, isLoading: categoriesLoading } = useCategories();

    // Mapear categorías a opciones del select
    const categoryOptions = useMemo(() => {
        return categories?.map((cat) => ({
            value: cat.id,
            label: cat.name,
        })) || [];
    }, [categories]);

    const methods = useForm<TestimonyFormData>({
        defaultValues: {
            title: '',
            body: '',
            category_id: '',
            email: '',
            author: '',
            tags: [],
        },
    });

    const createTestimonyMutation = useMutation({
        mutationFn: async (data: TestimonyFormData) => {
            let media_url = '';

            // Si es un video, subirlo a YouTube
            if (mediaType === 'video' && videoFile) {
                const title = data.title as string;

                const result = await handleUpload({
                    file: videoFile,
                    title: `Testimonio: ${title}`,
                    description: data.body
                });

                if (!result.success) {
                    throw new Error(result.error || 'Error al subir el video');
                }

                // Construir URL de YouTube
                media_url = `https://www.youtube.com/watch?v=${result.videoId}`;
            }

            // Si es una imagen, subirla a Cloudinary
            if (mediaType === 'image' && imageFile) {
                const result = await uploadToCloudinary({
                    file: imageFile,
                    folder: 'testimonials'
                });

                if (!result.success) {
                    throw new Error(result.error || 'Error al subir la imagen');
                }

                media_url = result.url || '';
            }

            // Preparar datos para el backend según CreateTestimonioDto
            const payload = {
                title: data.title,
                body: data.body,
                category_id: data.category_id,
                email: data.email,
                media_type: mediaType,
                status: 'pendiente',
                ...(data.author && { author: data.author }),
                ...(data.tags && data.tags.length > 0 && { tags: data.tags }),
                ...(media_url && { media_url }),
            };
            // Enviar a la API
            const response = await api.post(`/organizations/${currentOrganization}/testimonios`, payload, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                }
            });
            await analyticsServices.createEvent({
                metadata: {
                    event_type: 'submission',
                    testimonio_id: response.data.data.id
                }
            });
            return response.data;
            // return payload;
        },
        onSuccess: () => {
            toast.success('Testimonio creado exitosamente');
            methods.reset();
            setVideoFile(null);
            setImageFile(null);
            setMediaType('none');

            router.push('/dashboard');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al crear el testimonio');
        },
    });

    const onSubmit = (data: TestimonyFormData) => {
        // Validate file uploads
        if (mediaType === 'video' && !videoFile) {
            toast.error('Por favor sube un video');
            return;
        }

        if (mediaType === 'image' && !imageFile) {
            toast.error('Por favor sube una imagen');
            return;
        }

        createTestimonyMutation.mutate(data);
    };

    const mediaTypes = [
        { type: 'none' as MediaType, label: 'Texto', icon: RiTextWrap, color: 'text-teal-500', bg: 'bg-teal-100', activeBg: 'bg-teal-500' },
        { type: 'video' as MediaType, label: 'Video', icon: RiVideoLine, color: 'text-purple-500', bg: 'bg-purple-100', activeBg: 'bg-purple-500' },
        { type: 'image' as MediaType, label: 'Imagen', icon: RiImageLine, color: 'text-pink-500', bg: 'bg-pink-100', activeBg: 'bg-pink-500' },
    ];

    // Cargar borrador desde sessionStorage si existe
    useEffect(() => {
        const loadDraftData = sessionStorage.getItem('loadDraft');
        if (!loadDraftData) return;

        (async () => {
            try {
                const draft = JSON.parse(loadDraftData);
                setLoadedDraftId(draft.id ?? null);

                // Poblar formulario
                methods.reset({
                    title: draft.title,
                    body: draft.body,
                    category_id: draft.category_id,
                    email: draft.email,
                    author: draft.author,
                    tags: draft.tags,
                });

                // Establecer tipo de medio
                setMediaType(draft.mediaType);

                // Recuperar archivos desde IndexedDB si vienen como referencia
                if (draft.videoFile) {
                    if (draft.videoFile.id) {
                        const blob = await import('@/utils/indexedDB').then(m => m.getFile(draft.videoFile.id));
                        if (blob) {
                            const file = new File([blob], draft.videoFile.name, { type: draft.videoFile.type });
                            setVideoFile(file);
                        }
                    } else if (draft.videoFile.data) {
                        // compatibilidad anterior: base64/url
                        const blob = await fetch(draft.videoFile.data).then(res => res.blob());
                        const file = new File([blob], draft.videoFile.name, { type: draft.videoFile.type });
                        setVideoFile(file);
                    }
                }

                if (draft.imageFile) {
                    if (draft.imageFile.id) {
                        const blob = await import('@/utils/indexedDB').then(m => m.getFile(draft.imageFile.id));
                        if (blob) {
                            const file = new File([blob], draft.imageFile.name, { type: draft.imageFile.type });
                            setImageFile(file);
                        }
                    } else if (draft.imageFile.data) {
                        const blob = await fetch(draft.imageFile.data).then(res => res.blob());
                        const file = new File([blob], draft.imageFile.name, { type: draft.imageFile.type });
                        setImageFile(file);
                    }
                }

                // Limpiar sessionStorage inmediatamente después de cargar
                sessionStorage.removeItem('loadDraft');
                toast.success('Borrador cargado correctamente');
            } catch (error) {
                console.error('Error al cargar borrador:', error);
                toast.error('Error al cargar el borrador');
                sessionStorage.removeItem('loadDraft');
            }
        })();
    }, [methods]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Crear Testimonio</h1>
                <p className="text-foreground/60 mt-1">
                    Agrega un nuevo testimonio de cliente
                </p>
            </div>

            {/* Main Form Card */}
            <div className=" border border-foreground/10 rounded-2xl shadow-sm p-6 md:p-8">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">

                        {/* Testimony Type Selector */}
                        <div>
                            <label className="block font-bold text-foreground mb-3">
                                Tipo de Testimonio
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {mediaTypes.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = mediaType === item.type;

                                    return (
                                        <button
                                            key={item.type}
                                            type="button"
                                            onClick={() => setMediaType(item.type)}
                                            className={`
                        relative p-6 rounded-xl border-2 transition-all duration-200
                        ${isActive
                                                    ? `border-${item.color.replace('text-', '')} ${item.bg} dark:${item.bg}/20`
                                                    : 'border-foreground/10 hover:border-foreground/20 bg-background'
                                                }
                      `}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className={`
                          w-14 h-14 rounded-full flex items-center justify-center transition-all
                          ${isActive ? `${item.activeBg} text-white` : `${item.bg} ${item.color}`}
                        `}>
                                                    <Icon className="w-7 h-7" />
                                                </div>
                                                <span className={`font-semibold ${isActive ? 'text-foreground' : 'text-foreground/60'}`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <div className="absolute top-3 right-3 w-6 h-6 bg-btn-success rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}</div>
                        </div>

                        {/* Common Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputForm
                                label="Título del Testimonio"
                                formKey="title"
                                required
                                placeholder="Ej: Excelente experiencia con soporte"
                            />

                            <InputForm
                                label="Email del Cliente"
                                formKey="email"
                                type="email"
                                required
                                placeholder="Ej: cliente@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputForm
                                label="Autor (Nombre visible)"
                                formKey="author"
                                placeholder="Ej: María Gómez"
                            />

                            <SelectForm
                                label="Categoría"
                                formKey="category_id"
                                options={categoryOptions}
                                placeholder="Selecciona una categoría"
                                required
                                isLoading={categoriesLoading}
                            />
                        </div>

                        <InputForm
                            label="Cuerpo del Testimonio"
                            formKey="body"
                            type="textarea"
                            required
                            placeholder="Escribe el contenido del testimonio aquí..."
                            minLength={10}
                            maxLength={1000}
                        />

                        {/* Type-Specific Fields */}
                        <div className="pt-4 border-t border-foreground/10">
                            {mediaType === 'video' && (
                                <div>
                                    <label className="block font-bold text-foreground mb-3">
                                        Video del Testimonio <span className="text-btn-danger">*</span>
                                    </label>
                                    <FileUpload
                                        accept="video"
                                        onChange={setVideoFile}
                                        value={videoFile}
                                        maxSizeMB={50}
                                    />
                                    <p className="text-xs text-foreground/50 mt-2">
                                        Formatos aceptados: MP4, WebM, MOV. Tamaño máximo: 50MB
                                    </p>
                                </div>
                            )}

                            {mediaType === 'image' && (
                                <div>
                                    <label className="block font-bold text-foreground mb-3">
                                        Imagen del Testimonio <span className="text-btn-danger">*</span>
                                    </label>
                                    <FileUpload
                                        accept="image"
                                        onChange={setImageFile}
                                        value={imageFile}
                                        maxSizeMB={10}
                                    />
                                    <p className="text-xs text-foreground/50 mt-2">
                                        Formatos aceptados: JPG, PNG, WebP. Tamaño máximo: 10MB
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:justify-end sm:flex-row gap-4 pt-6">
                            <Button
                                type="submit"
                                variant="action"
                                color='green'
                                className="w-full sm:w-fit sm:px-8"

                                // size="fit"
                                isLoading={createTestimonyMutation.isPending}
                            // className="sm:flex-1"
                            >
                                Enviar para Revisión
                            </Button>

                            <Button
                                type="button"
                                variant="action"
                                className="w-full sm:w-fit sm:px-8"
                                color='orange'
                                onClick={async () => {
                                    const formData = methods.getValues();

                                    // Validar que al menos tenga título y cuerpo
                                    if (!formData.title || !formData.body) {
                                        toast.error('Por favor completa al menos el título y el cuerpo del testimonio');
                                        return;
                                    }

                                    try {
                                        // Guardar archivos grandes en IndexedDB y almacenar sólo la referencia en el borrador
                                        let videoFileData = null;
                                        let imageFileData = null;

                                        if (videoFile) {
                                            // guardar el Blob/File en IndexedDB y recibir id
                                            const id = await import('@/utils/indexedDB').then(m => m.saveFile(videoFile));
                                            videoFileData = {
                                                name: videoFile.name,
                                                type: videoFile.type,
                                                size: videoFile.size,
                                                id,
                                            };
                                        }

                                        if (imageFile) {
                                            const id = await import('@/utils/indexedDB').then(m => m.saveFile(imageFile));
                                            imageFileData = {
                                                name: imageFile.name,
                                                type: imageFile.type,
                                                size: imageFile.size,
                                                id,
                                            };
                                        }

                                        // Guardar borrador (sin base64 pesado)
                                        const draftId = useStore.getState().saveDraft({
                                            id: loadedDraftId ?? undefined,
                                            title: formData.title,
                                            body: formData.body,
                                            category_id: formData.category_id,
                                            email: formData.email,
                                            author: formData.author,
                                            tags: formData.tags,
                                            mediaType: mediaType,
                                            videoFile: videoFileData,
                                            imageFile: imageFileData,
                                        });

                                        // Actualizar el id cargado para futuras guardas
                                        setLoadedDraftId(draftId);

                                        toast.success('Borrador guardado en biblioteca');
                                        router.push('/dashboard/library');
                                    } catch (error) {
                                        toast.error('Error al guardar el borrador');
                                        console.error(error);
                                    }
                                }}
                            >
                                Guardar en biblioteca
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>

            {/* Info Card */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Consejos para crear testimonios efectivos
                </h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Los testimonios en video suelen tener mayor impacto y credibilidad</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Asegúrate de que las imágenes sean de alta calidad y relevantes</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Los testimonios específicos y detallados son más convincentes</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
