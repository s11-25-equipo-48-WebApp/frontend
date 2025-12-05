import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  message?: string;
  itemName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  // 1. Agregamos la propiedad opcional aquí
  isLoading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Eliminar',
  message = '¿Seguro que quieres eliminar esto?',
  itemName,
  confirmButtonText = 'Eliminar',
  cancelButtonText = 'Cancelar',
  // 2. La recibimos aquí (por defecto false)
  isLoading: externalLoading = false, 
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Creamos una variable que sea true si CUALQUIERA de los dos está cargando
  const isBusy = externalLoading || internalLoading;

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setInternalLoading(true);
    setError(null);

    try {
      await onConfirm();
      // Nota: Si el padre maneja el cierre, el onClose aquí podría ser redundante, 
      // pero lo dejamos por seguridad.
      onClose();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isBusy ? undefined : onClose} // Evitar cerrar si está cargando
      />

      <div className="relative bg-[#DBD1D5] rounded-3xl shadow-2xl w-full max-w-xl border-5 border-red-500">
        <div className="flex items-center justify-end px-6 py-2">
          <div className="flex flex-1 justify-center relative">
            <div className="absolute left-3 top-3 bg-white rounded-full p-2">
              <div className="bg-red-500/30 rounded-full p-2">
                <Trash2 size={32} className="text-red-500" />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-2 cursor-pointer hover:bg-foreground/5 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={24} className="text-foreground/60" />
          </button>
        </div>

        <div className="px-6 py-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <h2 className="text-2xl font-bold text-foreground flex justify-center flex-1 p-4">
              {title}
            </h2>
          </div>

          <div className="mb-6 text-center text-foreground font-semibold">
            <p>{message}</p>
            {itemName && (
              <p className="my-2 text-lg font-bold text-red-600">
                {itemName}
              </p>
            )}
            <p className="my-2 mb-8">Esta acción no se puede deshacer.</p>
          </div>

          <div className="flex justify-center gap-8">
            <button
              type="button"
              className="px-12 py-2 cursor-pointer bg-transparent shadow-md shadow-black/40 text-red-600 border-red-600 border-2 rounded-full hover:text-white hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              onClick={handleConfirm}
              // 4. Usamos la variable combinada
              disabled={isBusy}
            >
              {isBusy ? 'Eliminando...' : confirmButtonText}
            </button>
            <button
              type="button"
              className="px-12 py-2 cursor-pointer bg-transparent shadow-md shadow-black/40 border-white text-winered border-2 rounded-full hover:bg-foreground/5 transition-colors font-medium disabled:opacity-50"
              onClick={onClose}
              disabled={isBusy}
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;