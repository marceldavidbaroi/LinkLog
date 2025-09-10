import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "../types/auth";

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null, // access token in memory (now persisted too)
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearAuth: () => set({ user: null, token: null, error: null }),
    }),
    {
      name: "auth-storage", // key in localStorage
      // optional: choose what to persist
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
