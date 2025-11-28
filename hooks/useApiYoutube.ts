import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UploadToYouTubeParams {
    file: File;
    title: string;
    description?: string;
}

interface UploadResult {
    success: boolean;
    videoId?: string;
    error?: string;
}

/**
 * Sube un video a Supabase Storage y luego a YouTube
 * @param params - Parámetros de carga (archivo, título, descripción)
 * @returns Resultado de la carga con videoId o error
 */
export const handleUpload = async ({
    file,
    title,
    description = ''
}: UploadToYouTubeParams): Promise<UploadResult> => {
    try {
        // Validar parámetros
        if (!file) {
            toast.error('No se proporcionó ningún archivo');
            return { success: false, error: 'No file provided' };
        }

        if (!title || title.trim().length === 0) {
            toast.error('El título del video es requerido');
            return { success: false, error: 'Title is required' };
        }

        // Sanitizar nombre del archivo
        const sanitizeFileName = (fileName: string): string => {
            return fileName
                .normalize("NFD")                     // elimina acentos
                .replace(/[\u0300-\u036f]/g, "")      // quita diacríticos
                .replace(/[^a-zA-Z0-9._-]/g, "_")     // reemplaza caracteres no permitidos por "_"
                .replace(/\s+/g, "_")                 // reemplaza espacios por "_"
                .toLowerCase();                       // opcional: todo en minúsculas
        };

        const safeName = sanitizeFileName(file.name);
        const fileName = `${Date.now()}-${safeName}`;

        // Mostrar toast de inicio
        const uploadToastId = toast.loading('Subiendo video a la nube...');

        // 1. Subir a Supabase Storage (Directo desde el navegador)
        const { data: storageData, error: storageError } = await supabase.storage
            .from('uploads')
            .upload(fileName, file);

        if (storageError) {
            console.error('Error uploading to storage:', storageError);
            toast.update(uploadToastId, {
                render: 'Error al subir el archivo a la nube',
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
            return { success: false, error: storageError.message };
        }

        // Actualizar toast
        toast.update(uploadToastId, {
            render: 'Archivo en la nube. Procesando envío a YouTube...',
            type: 'info',
            isLoading: true
        });

        // 2. Invocar la Edge Function
        const { data: funcData, error: funcError } = await supabase.functions
            .invoke('upload-to-youtube', {
                body: {
                    filePath: fileName,
                    title: title.trim(),
                    description: description.trim()
                },
            });

        if (funcError) {
            console.error('Error uploading to YouTube:', funcError);
            toast.update(uploadToastId, {
                render: 'Error al enviar el video a YouTube',
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
            return { success: false, error: funcError.message };
        }

        // Éxito
        toast.update(uploadToastId, {
            render: `¡Video subido exitosamente! ID: ${funcData.videoId}`,
            type: 'success',
            isLoading: false,
            autoClose: 5000
        });

        return { success: true, videoId: funcData.videoId };

    } catch (error) {
        console.error('Unexpected error in handleUpload:', error);
        toast.error('Error inesperado al procesar el video');
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};