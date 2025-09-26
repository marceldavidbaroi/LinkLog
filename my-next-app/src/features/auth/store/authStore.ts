import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "../types/auth";

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearAuth: () => set({ user: null, token: null, error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        console.log("✅ Hydrated with:", state);
      },
    }
  )
);

export default useAuthStore;
