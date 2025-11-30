import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import useRefreshAccessTokenClient from "@/hooks/useRefreshToken.client";
import api from "@/services/config";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organization?: { id: number; name?: string } | null;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  organization = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const refreshAccessToken = useRefreshAccessTokenClient();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!organization) return;
    setLoading(true);
    setError(null);

    const doRequest = async (token?: string | null) => {
      return api.delete(`/organization/${organization.id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    };

    try {
      const token = session?.user?.accessToken as string | undefined;
      await doRequest(token);
      onSuccess();
      onClose();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            await doRequest(newToken);
            onSuccess();
            onClose();
            return;
          }
        } catch (refreshErr) {
          // fallthrough to set error
        }
      }

      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
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
            className="p-2 cursor-pointer hover:bg-foreground/5 rounded-full transition-colors"
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
              Eliminar Organización
            </h2>
          </div>

          <div className="mb-6 text-center text-foreground font-semibold">
            <p>¿Seguro que quieres eliminar esto?</p>
            <p className="my-2 mb-8">Esta acción no se puede deshacer.</p>
          </div>

          <div className="flex justify-center gap-8">
            <button
              type="button"
              className="px-12 py-2 cursor-pointer bg-transparent shadow-md shadow-black/40  text-red-600 border-red-600 border-2 rounded-full hover:text-white hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
            <button
              type="button"
              className="px-12 py-2 cursor-pointer bg-transparent shadow-md shadow-black/40 border-white text-winered border-2 rounded-full hover:bg-foreground/5 transition-colors font-medium disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
