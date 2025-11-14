import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// Modo de ejemplo simple de uso de Zustand con persistencia en localStorage 
interface store  {
  user: string | null;
  setUser: (_user: string) => void ;
  logout: () => void;
}
export const useStore = create<store>()(
  persist(
    (set) => ({
      // Define your state and actions here
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'my-zustand-store', storage: createJSONStorage(() => localStorage) } // unique name for storage
  )
);