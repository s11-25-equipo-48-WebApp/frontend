"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { RiSearchLine, RiDeleteBin6Line, RiLoader5Line } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/zustand";
import { toast } from "react-toastify";
import CategoryCard from "@/components/Modals/AddCategoryCard";
import DeleteModal from "@/components/Modals/DeleteModal";
import { categoryService, Category } from "@/services/dashboard.service";
import useRefreshAccessTokenClient from "@/hooks/useRefreshToken.client";
import { Tag, SquarePen } from "lucide-react";

export default function Page() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const { data: session } = useSession();
  const organizationId = useStore((s) => s.currentOrganization);
  const refreshToken = useRefreshAccessTokenClient();

  const accessToken = session?.user?.accessToken as string | undefined;

  const fetchCategories = async () => {
    if (!organizationId) return;
    setIsLoading(true);
    try {
      const newToken = await refreshToken();
      const tokenToUse = newToken ?? accessToken;
      const data = await categoryService.getCategories(
        organizationId,
        tokenToUse
      );
      setCategories(Array.isArray(data) ? data : []);
      refreshToken();
    } catch (error) {
      console.error("Error fetching categories", error);
      toast.error("Error cargando categorías");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const filtered = categories.filter((c) => {
    if (!query) return true;
    return c.name.toLowerCase().includes(query.toLowerCase());
  });

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);
  const anySelected = selectedIds.length > 0;

  const handleCreate = async (name: string) => {
    if (!organizationId) return toast.error("Organization ID no disponible");
    try {
      const newToken = await refreshToken();
      const tokenToUse = newToken ?? accessToken;
      await categoryService.createCategory(organizationId, name, tokenToUse);
      toast.success("Categoría creada");
      setShowAdd(false);
      await fetchCategories();
      refreshToken();
    } catch (error) {
      console.error("Error creando categoría", error);
      toast.error("Error creando categoría");
    }
  };

  const handleUpdate = async (name: string) => {
    if (!organizationId || !editTarget) return;
    try {
      const newToken = await refreshToken();
      const tokenToUse = newToken ?? accessToken;
      await categoryService.updateCategory(
        organizationId,
        editTarget.id,
        name,
        tokenToUse
      );
      toast.success("Categoría actualizada");
      setEditTarget(null);
      await fetchCategories();
      refreshToken();
    } catch (error) {
      console.error("Error actualizando categoría", error);
      toast.error("Error actualizando categoría");
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (!organizationId) return toast.error("Organization ID no disponible");
    setIsDeleting(true);
    try {
      const newToken = await refreshToken();
      const tokenToUse = newToken ?? accessToken;
      for (const id of ids) {
        await categoryService.deleteCategory(organizationId, id, tokenToUse);
      }
      toast.success("Categoría(s) eliminada(s)");
      setSelected({});
      await fetchCategories();
      refreshToken();
    } catch (error) {
      console.error("Error eliminando categoría", error);
      toast.error("Error eliminando categoría");
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            variant="action"
            color="green"
            size="fit"
            onClick={() => setShowAdd(true)}
            aria-label="Crear nueva categoría"
            className="px-8 py-3 flex items-center justify-center"
          >
            Crear nueva categoría
          </Button>
        </div>

        <div className="flex-1 max-w-lg w-full">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar categoría"
              className="w-full pl-10 py-3 rounded-full border border-foreground/10 shadow-sm"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60" />
          </div>
        </div>

        <div className="w-full md:w-auto mt-2 md:mt-0">
          <select className="bg-transparent border rounded-full px-8 py-3 border-foreground/10 shadow-sm w-full md:w-auto">
            <option>Filtrar</option>
          </select>
        </div>
      </div>

      <button
        aria-label="Eliminar seleccionados"
        onClick={() => setShowDelete(true)}
        className={` bg-[#FAC5C3] text-white rounded-full p-4 flex items-center justify-center shadow-md transition-all ${
          anySelected ? "px-3 flex" : "w-10 hidden"
        }`}
        disabled={!anySelected}
        title={
          anySelected
            ? `${selectedIds.length} seleccionad${
                selectedIds.length > 1 ? "os" : "o"
              }`
            : "Selecciona categorías para eliminar"
        }
      >
        <RiDeleteBin6Line size={28} />
        {anySelected && (
          <span className="ml-2 text-sm font-semibold">
            {selectedIds.length}
          </span>
        )}
      </button>

      {/* Estado vacío cuando no hay categorías */}
      {!isLoading && categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 rounded-full bg-[#BCDBB8]/20 flex items-center justify-center mb-6">
            <Tag size={48} className="text-[#BCDBB8]" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No tienes ninguna categoría
          </h3>
          <p className="text-foreground/60 mb-6">
            ¡Crea una para empezar a organizar tu contenido!
          </p>
          <Button
            variant="action"
            color="green"
            size="fit"
            onClick={() => setShowAdd(true)}
            className="px-8 py-3"
          >
            Crear mi primera categoría
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-12 items-center gap-4 text-sm font-semibold text-foreground/80 px-2">
            <div className="col-span-1"></div>
            <div className="col-span-5">Nombre</div>
            <div className="col-span-3">Usos</div>
            <div className="col-span-2 text-right">Creado</div>
            <div className="col-span-1 text-right"></div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px] space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <RiLoader5Line className="animate-spin w-6 h-6 mr-2 text-foreground/70" />
                  <span className="text-foreground/70">
                    Cargando categorías...
                  </span>
                </div>
              ) : (
                filtered.map((cat) => {
                  const isSel = !!selected[cat.id];
                  return (
                    <div
                      key={cat.id}
                      className={`min-w-[720px] grid grid-cols-12 items-center gap-4 rounded-xl p-4 shadow-sm transition-colors ${
                        isSel ? "bg-[#FAC5C3]" : "bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className="col-span-1 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={(e) =>
                            setSelected((s) => ({
                              ...s,
                              [cat.id]: e.target.checked,
                            }))
                          }
                          className="w-5 h-5"
                        />
                      </div>

                      <div className="col-span-5 flex items-center gap-4">
                        <div
                          className={`w-11 h-11 rounded-lg bg-[#BCDBB8] flex items-center justify-center text-white${
                            isSel
                              ? " ring-2 ring-emerald-500 bg-transparent"
                              : ""
                          }`}
                        >
                          <Tag size={28} />
                        </div>
                        <div>
                          <div
                            className="font-medium text-foreground"
                            title={cat.name}
                          >
                            {cat.name.length > 30
                              ? `${cat.name.substring(0, 30)}...`
                              : cat.name}
                          </div>
                          <div className="text-sm text-foreground/70">
                            ID: {cat.id}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-3 text-foreground/80">
                        {cat.usage_count}
                      </div>

                      <div className="col-span-2 text-right text-foreground/80">
                        {new Date(cat.created_at).toLocaleDateString()}
                      </div>

                      <div className="col-span-1 flex items-center justify-end">
                        <button
                          onClick={() => setEditTarget(cat)}
                          aria-label={`Editar ${cat.name}`}
                          className="p-2 rounded-full hover:bg-foreground/5 transition-colors cursor-pointer"
                        >
                          <SquarePen size={24} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowAdd(false)}
          />
          <div className="relative">
            <CategoryCard
              onClose={() => setShowAdd(false)}
              onConfirm={handleCreate}
              onError={(msg) => toast.error(msg)}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setEditTarget(null)}
          />
          <div className="relative">
            <CategoryCard
              initialName={editTarget.name}
              onClose={() => setEditTarget(null)}
              onConfirm={handleUpdate}
              onError={(msg) => toast.error(msg)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <DeleteModal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            if (selectedIds.length > 0) await handleDelete(selectedIds);
            else setShowDelete(false);
          }}
          isLoading={isDeleting}
          title={`Eliminar ${selectedIds.length} categoría(s)`}
          message={`¿Seguro que quieres eliminar ${selectedIds.length} categoría(s)?`}
          confirmButtonText="Eliminar"
          cancelButtonText="Cancelar"
        />
      )}
    </div>
  );
}
