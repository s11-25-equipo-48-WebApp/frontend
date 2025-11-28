import { toast } from 'react-toastify';

interface UploadToCloudinaryParams {
    file: File;
    folder?: string;
}

interface CloudinaryUploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * Sube una imagen a Cloudinary y devuelve la URL pública
 * @param params - Parámetros de carga (archivo, carpeta opcional)
 * @returns Resultado de la carga con URL o error
 */
export const uploadToCloudinary = async ({
    file,
    folder = 'testimonials'
}: UploadToCloudinaryParams): Promise<CloudinaryUploadResult> => {
    try {
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            toast.error('El archivo debe ser una imagen');
            return { success: false, error: 'File must be an image' };
        }

        // Obtener credenciales de Cloudinary desde variables de entorno
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error('Missing Cloudinary credentials');
            toast.error('Configuración de Cloudinary no encontrada');
            return { success: false, error: 'Missing Cloudinary configuration' };
        }

        // Mostrar toast de inicio
        const uploadToastId = toast.loading('Subiendo imagen a Cloudinary...');

        // Crear FormData para Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', folder);

        // Subir a Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Cloudinary upload error:', errorData);
            toast.update(uploadToastId, {
                render: 'Error al subir la imagen',
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
            return { success: false, error: errorData.error?.message || 'Upload failed' };
        }

        const data = await response.json();

        // Éxito
        toast.update(uploadToastId, {
            render: '¡Imagen subida exitosamente!',
            type: 'success',
            isLoading: false,
            autoClose: 3000
        });

        return { success: true, url: data.secure_url };

    } catch (error) {
        console.error('Unexpected error in uploadToCloudinary:', error);
        toast.error('Error inesperado al procesar la imagen');
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
