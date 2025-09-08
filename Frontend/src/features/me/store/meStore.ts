import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MeState } from "../types/me.type";

const useMeStore = create(
  persist<MeState>(
    (set) => ({
      me: null,
      loading: false,
      error: null,

      setMe: (me) => set({ me }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      updatePreferences: (preferences) =>
        set((state) =>
          state.me
            ? {
                me: {
                  ...state.me,
                  preferences: {
                    ...state.me.preferences,
                    ...preferences,
                  },
                },
              }
            : state
        ),
    }),
    { name: "me-storage" } // stored in localStorage
  )
);

export default useMeStore;
