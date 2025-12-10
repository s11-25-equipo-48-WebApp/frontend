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
import DeleteModal from "@/components/Modals/DeleteModal";
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
      {/* Contenido: estado vacío o tabla de editores */}
      {!isLoadingMembers && editors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 rounded-full bg-[#FFEFCC]/20 flex items-center justify-center mb-6">
            <RiUser3Line size={48} className="text-[#F5C85C]" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No tienes ningún editor
          </h3>
          <p className="text-foreground/60 mb-6">
            Invita a miembros de tu equipo para que puedan publicar testimonios.
          </p>
          <Button
            variant="action"
            color="yellow"
            size="fit"
            onClick={() => setShowInvite(true)}
            className="px-8 py-3"
          >
            Invitar mi primer editor
          </Button>
        </div>
      ) : (
        <>
          {/* Table header labels (visually) */}
          <div className="grid grid-cols-12 items-center gap-4 text-sm font-semibold text-foreground/80 px-2">
            <div className="col-span-1"></div>
            <div className="col-span-4">Nombre</div>
            <div className="col-span-5">Correo electrónico</div>
            <div className="col-span-2 text-right">Testimonios Publicados</div>
          </div>

          {/* List */}
          <div className=" overflow-x-auto">
            <div className="space-y-4 min-w-[720px]">
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
                      className={`min-w-[720px] grid grid-cols-12 items-center gap-4 rounded-xl p-4 shadow-sm transition-colors ${
                        isSel ? "bg-[#FAC5C3]" : "bg-white dark:bg-slate-900"
                      }`}>
                      <div className="col-span-1 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSel}
                          disabled={editor.id === currentUserId}
                          className="w-5 h-5"
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
                        <div
                          className={`w-10 h-10 rounded-lg ring-1 ring-yellow-500 text-yellow-800 flex items-center justify-center shrink-0 ${
                            isSel ? "bg-transparent text-white" : ""
                          }`}>
                          <RiUser3Line
                            className={isSel ? "text-white" : ""}
                            size={24}
                          />
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
          </div>
        </>
      )}

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

      {/* Delete Modal (single or bulk) - replaced with shared DeleteModal component */}
      <DeleteModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setDeleteTarget(null);
        }}
        onConfirm={async () => {
          if (deleteTarget) {
            await handleDelete([deleteTarget.id]);
          } else if (selectedIds.length > 0) {
            await handleDelete(selectedIds);
          } else {
            setShowDelete(false);
          }
        }}
        isLoading={isDeleting}
        title={
          deleteTarget
            ? "Eliminar miembro"
            : `Eliminar ${selectedIds.length} miembro(s)`
        }
        message={
          deleteTarget
            ? `¿Seguro que quieres eliminar a ${deleteTarget.name}?`
            : `¿Seguro que quieres eliminar ${selectedIds.length} miembro(s)?`
        }
        itemName={deleteTarget ? deleteTarget.name : undefined}
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
      />
    </div>
  );
}
