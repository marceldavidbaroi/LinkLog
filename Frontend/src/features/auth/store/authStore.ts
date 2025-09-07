import { create } from "zustand";
import type { AuthState } from "../types/auth";

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null, // access token in memory
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearAuth: () => set({ user: null, token: null, error: null }),
}));

export default useAuthStore;
