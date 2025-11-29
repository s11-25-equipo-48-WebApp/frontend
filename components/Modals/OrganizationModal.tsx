import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import api from "@/services/config";
import Button from "@/components/Button";

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organization?: {
    id: number;
    name: string;
    description: string;
  } | null;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  organization = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, update } = useSession();

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name ?? "",
        description: organization.description ?? "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
    setError(null);
  }, [organization, isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const url = organization ? `/organization/${organization.id}` : "/organization";
    const method = organization ? "patch" : "post";

    const doRequest = async (token?: string | null) => {
      return api.request({
        url,
        method,
        data: formData,
        headers: {
          "Content-Type": "application/json",
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
      // If unauthorized/forbidden, try to refresh token and retry once
      if (status === 401 || status === 403) {
        try {
          const refreshResp = await api.post("/auth/refresh");
          const newToken = refreshResp?.data?.accessToken;
          if (newToken) {
            // update next-auth session with new token if available
            try {
              await update?.({ user: { ...(session?.user as any), accessToken: newToken } });
            } catch (uErr) {
              // ignore update errors
            }

            await doRequest(newToken);
            onSuccess();
            onClose();
            return;
          }
        } catch (refreshErr) {
          // fallthrough to set error below
        }
      }

      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#DBD1D5] rounded-3xl shadow-2xl w-full max-w-3xl  border-4 border-white">
        <div className="flex items-center justify-between px-6 py-4 ">
          <h2 className="text-2xl font-bold text-winered flex justify-center flex-1 p-4">
            {organization ? "Editar Organización" : "Crear nueva Organización"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
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

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-md font-medium text-foreground mb-2"
            >
              Nombre de la organización
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingrese un nombre de organización"
              required
              className="w-full px-4 py-4 bg-[#DBD1D5] border-4 border-white rounded-lg text-foreground focus:outline-none focus:border-winered/20 transition-colors"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-md font-medium text-foreground mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-6 bg-[#DBD1D5] border-4 border-white rounded-lg text-foreground focus:outline-none focus:border-winered/20 transition-colors"
              placeholder="Ingrese una descripción"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="ml-auto px-8 py-2 cursor-pointer bg-winered border-white border-2 text-white rounded-full hover:bg-winered/90 transition-colors font-medium disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Guardando..." : organization ? "Actualizar" : "Crear"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationModal;
