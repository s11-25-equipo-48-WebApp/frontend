import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Interfaz para borradores de testimonios
export interface TestimonyDraft {
  id: string;
  title: string;
  body: string;
  category_id: string;
  email: string;
  author?: string;
  tags?: string[];
  mediaType: "none" | "video" | "image";
  videoFile?: {
    name: string;
    type: string;
    size: number;
    id: string; // referencia en IndexedDB
  } | null;
  imageFile?: {
    name: string;
    type: string;
    size: number;
    id: string; // referencia en IndexedDB
  } | null;
  savedAt: number; // timestamp
}

// Modo de ejemplo simple de uso de Zustand con persistencia en localStorage
interface store {
  currentOrganization: string | null;
  setCurrentOrganization: (_organization: string | null) => void;
  drafts: TestimonyDraft[];
  saveDraft: (_draft: Omit<TestimonyDraft, "id" | "savedAt">) => void;
  deleteDraft: (_id: string) => void;
  loadDraft: (_id: string) => TestimonyDraft | undefined;
}

export const useStore = create<store>()(
  persist(
    (set, get) => ({
      currentOrganization: null,
      // Ahora aceptamos y guardamos el ID (string) o null
      setCurrentOrganization: (organizationId: string | null) =>
        set({ currentOrganization: organizationId }),

      // Estado de borradores
      drafts: [],

      // Guardar o actualizar borrador
      saveDraft: (draft) => {
        const id = `draft-${Date.now()}`;
        const savedAt = Date.now();
        const newDraft: TestimonyDraft = {
          ...draft,
          id,
          savedAt,
        };

        set((state) => ({
          drafts: [...state.drafts, newDraft],
        }));
      },

      // Eliminar borrador
      deleteDraft: (id) => {
        // Intentar borrar también los archivos referenciados en IndexedDB
        const draftToDelete = get().drafts.find((d) => d.id === id);
        if (draftToDelete) {
          try {
            if (draftToDelete.videoFile && draftToDelete.videoFile.id) {
              import("@/utils/indexedDB")
                .then((m) => m.deleteFile(draftToDelete.videoFile!.id))
                .catch(() => {});
            }
            if (draftToDelete.imageFile && draftToDelete.imageFile.id) {
              import("@/utils/indexedDB")
                .then((m) => m.deleteFile(draftToDelete.imageFile!.id))
                .catch(() => {});
            }
          } catch (e) {
            // no bloquear el borrado por errores en IndexedDB
            console.warn("Error intentando borrar archivos de IndexedDB", e);
          }
        }

        set((state) => ({
          drafts: state.drafts.filter((draft) => draft.id !== id),
        }));
      },

      // Cargar borrador específico
      loadDraft: (id) => {
        return get().drafts.find((draft) => draft.id === id);
      },
    }),
    {
      name: "testimony-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
