'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { RiCloseLine, RiImageLine, RiVideoLine } from 'react-icons/ri';

interface FileUploadProps {
    accept: 'image' | 'video';
    onChange: (file: File | null) => void;
    value?: File | null;
    error?: string;
    maxSizeMB?: number;
}

export default function FileUpload({
    accept,
    onChange,
    value,
    error,
    maxSizeMB = 50
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const acceptedTypes = accept === 'image'
        ? 'image/jpeg,image/png,image/webp,image/jpg'
        : 'video/mp4,video/webm,video/mov';

    const acceptedExtensions = accept === 'image'
        ? '.jpg, .jpeg, .png, .webp'
        : '.mp4, .webm, .mov';

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const validateFile = (file: File): string | null => {
        // Check file type
        const fileType = file.type;
        const validTypes = acceptedTypes.split(',');
        if (!validTypes.includes(fileType)) {
            return `Tipo de archivo no válido. Solo se permiten: ${acceptedExtensions}`;
        }

        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            return `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`;
        }

        return null;
    };

    const handleFile = (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            toast.error(validationError);
            onChange(null);
            return;
        }

        onChange(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleRemove = () => {
        onChange(null);
        setPreview(null);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="w-full">
            {!value ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            relative border-2 border-dashed rounded-xl p-8 transition-all duration-200
            ${isDragging
                            ? 'border-btn-primary bg-btn-primary/5 scale-[1.02]'
                            : 'border-gray-300 dark:border-gray-600 hover:border-btn-primary/50'
                        }
            bg-background
          `}
                >
                    <input
                        type="file"
                        accept={acceptedTypes}
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center gap-3 pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-btn-primary/10 flex items-center justify-center">
                            {accept === 'image' ? (
                                <RiImageLine className="w-8 h-8 text-btn-primary" />
                            ) : (
                                <RiVideoLine className="w-8 h-8 text-btn-primary" />
                            )}
                        </div>

                        <div className="text-center">
                            <p className="text-foreground font-semibold mb-1">
                                Arrastra tu {accept === 'image' ? 'imagen' : 'video'} aquí
                            </p>
                            <p className="text-sm text-foreground/60">
                                o haz clic para seleccionar
                            </p>
                        </div>

                        <div className="text-xs text-foreground/50 text-center">
                            <p>Formatos aceptados: {acceptedExtensions}</p>
                            <p>Tamaño máximo: {maxSizeMB}MB</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-background">
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-btn-danger/10 hover:bg-btn-danger/20 flex items-center justify-center transition-colors z-10"
                    >
                        <RiCloseLine className="w-5 h-5 text-btn-danger" />
                    </button>

                    {accept === 'image' && preview ? (
                        <div className="w-full">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                    ) : accept === 'video' && preview ? (
                        <div className="w-full">
                            <video
                                src={preview}
                                controls
                                className="w-full h-64 rounded-lg bg-black"
                            />
                        </div>
                    ) : null}

                    <div className="mt-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-foreground truncate max-w-xs">
                                {value.name}
                            </p>
                            <p className="text-xs text-foreground/60">
                                {formatFileSize(value.size)}
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-btn-success/10 text-btn-success text-xs font-semibold rounded-full">
                            Listo
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-btn-danger font-semibold">
                    {error}
                </p>
            )}
        </div>
    );
}
