"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { RiSearchLine, RiDeleteBin6Line, RiLoader5Line } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/zustand";
import { toast } from "react-toastify";
import CategoryCard from "@/components/Modals/CategoryCard";
import { categoryService, Category } from "@/services/dashboard.service";
import useRefreshAccessTokenClient from "@/hooks/useRefreshToken.client";

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
      const data = await categoryService.getCategories(
        organizationId,
        accessToken
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
      await categoryService.createCategory(organizationId, name, accessToken);
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
      await categoryService.updateCategory(
        organizationId,
        editTarget.id,
        name,
        accessToken
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
      for (const id of ids) {
        await categoryService.deleteCategory(organizationId, id, accessToken);
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="action"
            color="green"
            size="fit"
            onClick={() => setShowAdd(true)}
          >
            Agregar categoría
          </Button>
        </div>

        <div className="flex-1 max-w-lg">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar categoría"
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
        onClick={() => setShowDelete(true)}
        className={` bg-emerald-100 text-emerald-700 rounded-full h-10 flex items-center justify-center shadow-md transition-all ${
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
        <RiDeleteBin6Line className="w-5 h-5" />
        {anySelected && (
          <span className="ml-2 text-sm font-semibold">
            {selectedIds.length}
          </span>
        )}
      </button>

      <div className="grid grid-cols-12 items-center gap-4 text-sm font-semibold text-foreground/80 px-2">
        <div className="col-span-1"></div>
        <div className="col-span-5">Nombre</div>
        <div className="col-span-3">Usos</div>
        <div className="col-span-3 text-right">Creado</div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RiLoader5Line className="animate-spin w-6 h-6 mr-2 text-foreground/70" />
            <span className="text-foreground/70">Cargando categorías...</span>
          </div>
        ) : (
          filtered.map((cat) => {
            const isSel = !!selected[cat.id];
            return (
              <div
                key={cat.id}
                className={`grid grid-cols-12 items-center gap-4 rounded-xl p-4 shadow-sm transition-colors ${
                  isSel ? "bg-emerald-50" : "bg-white dark:bg-slate-900"
                }`}
              >
                <div className="col-span-1 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, [cat.id]: e.target.checked }))
                    }
                  />
                </div>

                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-emerald-300 flex items-center justify-center text-white">
                    <svg
                      className="w-5 h-5 text-emerald-800"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.59 13.41L11 3.83 9.59 5.24 19.17 14.83 20.59 13.41zM7 7L2 12l5 5 5-5L7 7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {cat.name}
                    </div>
                    <div className="text-sm text-foreground/70">
                      ID: {cat.id}
                    </div>
                  </div>
                </div>

                <div className="col-span-3 text-foreground/80">
                  {cat.usage_count}
                </div>

                <div className="col-span-3 text-right text-foreground/80">
                  {new Date(cat.created_at).toLocaleDateString()}
                </div>

                <div className="col-span-12 text-right mt-3 sm:mt-0 sm:col-span-0">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setEditTarget(cat)}>
                      Editar
                    </Button>
                    <Button
                      variant="primary"
                      color="red"
                      onClick={() => {
                        setSelected({ [cat.id]: true });
                        setShowDelete(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

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
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDelete(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-lg border-2 border-red-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Eliminar categoría(s)</h3>
              <button onClick={() => setShowDelete(false)}>×</button>
            </div>
            <p className="mt-4 text-foreground/70">
              ¿Seguro que quieres eliminar {selectedIds.length} categoría(s)?
              Esta acción no se puede deshacer.
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
                onClick={() => handleDelete(selectedIds)}
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
