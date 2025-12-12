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

  // Fetch members con mejor debugging
  const fetchMembers = async () => {
    if (!organizationId) {
      console.log("❌ No hay organizationId");
      return;
    }

    console.log("🔍 Fetching members para org:", organizationId);
    setIsLoadingMembers(true);

    try {
      const newToken = await refreshToken();
      const tokenToUse =
        newToken ?? (session?.user?.accessToken as string | undefined);

      console.log("🔑 Token disponible:", !!tokenToUse);

      const { data, status } = await api.get(
        `/organization/${organizationId}/members`,
        {
          headers: {
            Authorization: tokenToUse ? `Bearer ${tokenToUse}` : undefined,
          },
        }
      );

      console.log("✅ Response status:", status);
      console.log("📦 Response data:", data);
      console.log("📊 Data type:", typeof data, Array.isArray(data));

      // Intentar diferentes estructuras de respuesta
      let membersList: Editor[] = [];

      if (Array.isArray(data)) {
        console.log("✓ Data es array directo");
        membersList = data;
      } else if (data && Array.isArray(data.items)) {
        console.log("✓ Data.items es array");
        membersList = data.items;
      } else if (data && Array.isArray(data.members)) {
        console.log("✓ Data.members es array");
        membersList = data.members;
      } else if (data && Array.isArray(data.data)) {
        console.log("✓ Data.data es array");
        membersList = data.data;
      } else {
        console.warn(
          "⚠️ Estructura de datos no reconocida:",
          Object.keys(data || {})
        );
        membersList = [];
      }

      console.log("👥 Members encontrados:", membersList.length);
      setEditors(membersList);

      // Ensure current user is not selected
      if (currentUserId) {
        setSelected((s) => ({ ...s, [currentUserId]: false }));
      }
    } catch (error: any) {
      console.error("❌ Error fetching members:", error);
      console.error("📍 Error response:", error.response?.data);
      console.error("🔢 Error status:", error.response?.status);

      if (error.response?.status === 401) {
        toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
      } else if (error.response?.status === 403) {
        toast.error("No tienes permisos para ver los miembros");
      } else if (error.response?.status === 404) {
        toast.error("Organización no encontrada");
      } else {
        toast.error(
          `Error cargando miembros: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      console.log("🚀 Iniciando fetch de members");
      fetchMembers();
    } else {
      console.log("⏳ Esperando organizationId...");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const handleDelete = async (ids: string[]) => {
    if (!organizationId) {
      toast.error("Organization ID no disponible");
      return;
    }

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
      await fetchMembers();
      setSelected({});
      refreshToken();
    } catch (error: any) {
      console.error("❌ Error eliminando miembros:", error);
      console.error("📍 Error response:", error.response?.data);
      toast.error(
        `Error al eliminar: ${error.response?.data?.message || error.message}`
      );
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

    let successCount = 0;
    let errorCount = 0;

    try {
      const newToken = await refreshToken();
      const tokenToUse =
        newToken ?? (session?.user?.accessToken as string | undefined);

      for (const email of emails) {
        try {
          toast.success("📨 Enviando invitación a:" + email);

          const response = await api.post(
            `/organization/${organizationId}/members`,
            { email, role: "editor" },
            {
              headers: {
                Authorization: tokenToUse ? `Bearer ${tokenToUse}` : undefined,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("✅ Invitación exitosa:", response.data);
          successCount++;
        } catch (error: any) {
          errorCount++;

          const errorMsg = error.response?.data?.message || error.message;
          toast.error(`Error invitando a ${email}: ${errorMsg}`);
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} invitación(es) enviada(s)`);
        setShowInvite(false);
        // Recargar miembros
        await fetchMembers();
        refreshToken();
      }

      if (errorCount > 0 && successCount === 0) {
        toast.error("No se pudo enviar ninguna invitación");
      }
    } catch (error: any) {
      console.error("❌ Error general invitando editores:", error);
      toast.error("Error al procesar invitaciones");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="action"
            color="yellow"
            size="fit"
            onClick={() => setShowInvite(true)}
            className="px-8 py-3 flex items-center justify-center"
          >
            Invitar nuevo editor
          </Button>
        </div>

        <div className="flex-1 max-w-lg w-full">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o correo"
              className="w-full pl-10 py-3 rounded-full border border-foreground/10 shadow-sm"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60" />
          </div>
        </div>

        <div className="w-full md:w-auto mt-2 md:mt-0">
          <select className="bg-transparent border w-full md:w-auto rounded-full px-8 py-3 border-foreground/10 shadow-sm">
            <option>Filtrar</option>
          </select>
        </div>
      </div>

      <button
        aria-label="Eliminar seleccionados"
        name="eliminar miembros seleccionados"
        onClick={() => setShowDelete(true)}
        className={`bg-[#FAC5C3] text-white rounded-full h-16 p-4 flex items-center justify-center shadow-md cursor-pointer transition-all ${
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

      {/* Table header */}
      <div className="grid grid-cols-12 items-center gap-4 text-sm font-semibold text-foreground/80 px-2">
        <div className="col-span-1"></div>
        <div className="col-span-4">Nombre</div>
        <div className="col-span-5">Correo electrónico</div>
        <div className="col-span-2 text-right">Testimonios Publicados</div>
      </div>

      {/* List */}
      <div className="overflow-x-auto">
        <div className="space-y-4 min-w-[720px]">
          {isLoadingMembers ? (
            <div className="flex items-center justify-center p-8">
              <RiLoader5Line className="animate-spin w-6 h-6 mr-2 text-foreground/70" />
              <span className="text-foreground/70">Cargando miembros...</span>
            </div>
          ) : editors.length === 0 ? (
            <div className="text-center p-8 text-foreground/60">
              No hay miembros en la organización aún. Invita al primer editor.
            </div>
          ) : (
            filtered.map((editor) => {
              const isSel = !!selected[editor.id];
              return (
                <div
                  key={editor.id}
                  className={`min-w-[720px] grid grid-cols-12 items-center gap-4 rounded-xl p-4 shadow-sm transition-colors ${
                    isSel ? "bg-[#FAC5C3]" : "bg-white dark:bg-slate-900"
                  }`}
                >
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
                      className={`w-10 h-10 rounded-lg ring-1 bg-yellow-500 text-yellow-800 flex items-center justify-center shrink-0 ${
                        isSel ? "bg-transparent text-white" : ""
                      }`}
                    >
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

      {/* Invite Modal */}
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

      {/* Delete Modal */}
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
