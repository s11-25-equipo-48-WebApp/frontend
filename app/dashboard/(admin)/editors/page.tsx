"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import {
  RiSearchLine,
  RiUser3Line,
  RiDeleteBin6Line,
  RiLoader5Line,
} from "react-icons/ri";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/zustand";
import api from "@/services/config";
import { toast } from "react-toastify";
import AddUserCard from "@/components/Modals/AddUserCard";
import useRefreshAccessTokenClient from "@/hooks/useRefreshToken.client";

type Editor = {
  id: string;
  name: string;
  email: string;
  testimonioCount: number;
};

export default function Page() {
  const [query, setQuery] = useState("");
  const [editors, setEditors] = useState<Editor[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showInvite, setShowInvite] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Editor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const refreshToken = useRefreshAccessTokenClient();
  // backend no soporta paginación: carga completa

  const { data: session } = useSession();
  const organizationId = useStore((s) => s.currentOrganization);
  const currentUserId = session?.user?.id as string | undefined;

  // Filtered by search
  const filtered = editors.filter((e) => {
    if (!query) return true;
    return (
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.email.toLowerCase().includes(query.toLowerCase())
    );
  });

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);
  const anySelected = selectedIds.length > 0;

  // Fetch members. Backend devuelve lista completa (sin paginación)
  const fetchMembers = async () => {
    if (!organizationId) return;
    setIsLoadingMembers(true);
    try {
      const newToken = await refreshToken();
      const tokenToUse =
        newToken ?? (session?.user?.accessToken as string | undefined);
      const { data } = await api.get(
        `/organization/${organizationId}/members`,
        {
          headers: {
            Authorization: tokenToUse ? `Bearer ${tokenToUse}` : undefined,
          },
        }
      );
      if (Array.isArray(data)) {
        setEditors(data);
      } else if (data && Array.isArray(data.items)) {
        setEditors(data.items);
      } else if (data && Array.isArray(data.members)) {
        setEditors(data.members);
      } else {
        // fallback: try to set editors empty
        setEditors([]);
      }

      // ensure current user is not selected
      if (currentUserId) setSelected((s) => ({ ...s, [currentUserId]: false }));
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Error cargando miembros");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (organizationId) fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const handleDelete = async (ids: string[]) => {
    if (!organizationId) {
      toast.error("Organization ID no disponible");
      return;
    }

    // proteger contra borrar al propio usuario
    if (currentUserId && ids.includes(currentUserId)) {
      toast.error("No puedes eliminar tu propia cuenta");
      return;
    }

    setIsDeleting(true);
    try {
      for (const userId of ids) {
        const newToken = await refreshToken();
        const tokenToUse =
          newToken ?? (session?.user?.accessToken as string | undefined);
        await api.delete(`/organization/${organizationId}/members/${userId}`, {
          headers: {
            Authorization: tokenToUse ? `Bearer ${tokenToUse}` : undefined,
          },
        });
      }
      toast.success(`${ids.length} miembro(s) eliminado(s)`);
      // refrescar
      await fetchMembers();
      setSelected({});
      refreshToken();
    } catch (error) {
      console.error("Error eliminando miembros:", error);
      toast.error("Error al eliminar miembros");
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
      setDeleteTarget(null);
    }
  };
  const handleClose = () => {
    setShowInvite(false);
    setShowDelete(false);
  };
  const handleInviteEditors = async (emails: string[]) => {
    if (!organizationId) {
      toast.error("Organization ID no disponible");
      return;
    }

    try {
      const newToken = await refreshToken();
      const tokenToUse =
        newToken ?? (session?.user?.accessToken as string | undefined);
      for (const email of emails) {
        await api.post(
          `/organization/${organizationId}/members`,
          { email, role: "editor" },
          {
            headers: {
              Authorization: tokenToUse ? `Bearer ${tokenToUse}` : undefined,
            },
          }
        );
      }
      toast.success(`${emails.length} invitación(es) enviada(s)`);
      setShowInvite(false);
      // recargar
      await fetchMembers();
      refreshToken();
    } catch (error) {
      console.error("Error invitando editores:", error);
      toast.error("Error al invitar editores");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="action"
            color="yellow"
            size="fit"
            onClick={() => setShowInvite(true)}
          >
            Invitar nuevo editor
          </Button>
        </div>

        <div className="flex-1 max-w-lg">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o correo"
              className="w-full pl-10 py-1 rounded-full border border-foreground/10 shadow-sm"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60" />
          </div>
        </div>

        <div>
          <select className="bg-transparent border rounded-full px-4 py-1 border-foreground/10 shadow-sm">
            <option>Filtrar</option>
          </select>
        </div>
      </div>
      <button
        aria-label="Eliminar seleccionados"
        name="eliminar miembros seleccionados"
        onClick={() => setShowDelete(true)}
        className={` bg-[#FAC5C3] text-white rounded-full h-16 p-4 flex items-center justify-center shadow-md cursor-pointer transition-all ${
          anySelected ? "px-3 flex" : "w-10 hidden"
        }`}
        disabled={!anySelected}
        title={
          anySelected
            ? `${selectedIds.length} seleccionad${
                selectedIds.length > 1 ? "os" : "o"
              }`
            : "Selecciona miembros para eliminar"
        }
      >
        <RiDeleteBin6Line size={28} />
        {anySelected && (
          <span className="ml-2 text-sm font-semibold">
            {selectedIds.length}
          </span>
        )}
      </button>
      {/* Table header labels (visually) */}
      <div className="grid grid-cols-12 items-center gap-4 text-sm font-semibold text-foreground/80 px-2">
        <div className="col-span-1"></div>
        <div className="col-span-4">Nombre</div>
        <div className="col-span-5">Correo electrónico</div>
        <div className="col-span-2 text-right">Testimonios Publicados</div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoadingMembers ? (
          <div className="flex items-center justify-center p-8">
            <RiLoader5Line className="animate-spin w-6 h-6 mr-2 text-foreground/70" />
            <span className="text-foreground/70">Cargando miembros...</span>
          </div>
        ) : (
          filtered.map((editor) => {
            const isSel = !!selected[editor.id];
            return (
              <div
                key={editor.id}
                className={`grid grid-cols-12 items-center gap-4 rounded-xl p-4 shadow-sm transition-colors ${
                  isSel ? "bg-[#FAC5C3]" : "bg-white dark:bg-slate-900"
                }`}
              >
                <div className="col-span-1 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isSel}
                    disabled={editor.id === currentUserId}
                    onChange={(e) =>
                      setSelected((s) => ({
                        ...s,
                        [editor.id]: e.target.checked,
                      }))
                    }
                    title={
                      editor.id === currentUserId
                        ? "No puedes seleccionar tu propia cuenta"
                        : undefined
                    }
                  />
                </div>

                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-yellow-300 flex items-center justify-center text-white">
                    <RiUser3Line className="w-6 h-6 text-yellow-800" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {editor.name}
                    </div>
                  </div>
                </div>

                <div className="col-span-5 text-foreground/80 truncate">
                  {editor.email}
                </div>

                <div className="col-span-2 text-right font-medium">
                  {editor.testimonioCount}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* no pagination: backend no la soporta */}

      {/* Invite Modal - using AddUserCard */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
          <div className="relative">
            <AddUserCard
              onClose={handleClose}
              onConfirm={handleInviteEditors}
            />
          </div>
        </div>
      )}

      {/* Delete Modal (single or bulk) */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDelete(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-lg border-2 border-red-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Eliminar miembro
                {deleteTarget ? "" : selectedIds.length > 1 ? "s" : ""}
              </h3>
              <button onClick={() => setShowDelete(false)}>×</button>
            </div>
            <p className="mt-4 text-foreground/70">
              ¿Seguro que quieres eliminar{" "}
              {deleteTarget
                ? "este miembro"
                : `${selectedIds.length} miembro(s)`}
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowDelete(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                color="red"
                isLoading={isDeleting}
                onClick={() => {
                  if (deleteTarget) {
                    handleDelete([deleteTarget.id]);
                  } else if (selectedIds.length > 0) {
                    handleDelete(selectedIds);
                  } else {
                    setShowDelete(false);
                  }
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
