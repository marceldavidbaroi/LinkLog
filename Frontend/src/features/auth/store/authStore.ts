import { create } from "zustand";
import type { AuthState } from "../types/auth";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearAuth: () =>
        set({ user: null, token: null, refreshToken: null, error: null }),
    }),
    { name: "auth-storage" } // key in localStorage
  )
);

export default useAuthStore;
