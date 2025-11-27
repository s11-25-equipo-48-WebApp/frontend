import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// Modo de ejemplo simple de uso de Zustand con persistencia en localStorage 
interface store {
  currentOrganization: string | null;
  setCurrentOrganization: (_organizationId: string) => void;
}
export const useStore = create<store>()(
  persist(
    (set) => ({
      currentOrganization: null,
      setCurrentOrganization: (organizationId: string) => set({ currentOrganization: organizationId }),
    }),
    { name: 'current-organization', storage: createJSONStorage(() => localStorage) } // unique name for storage
  )
);