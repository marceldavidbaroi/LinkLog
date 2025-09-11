import { create } from "zustand";
import type { InteractionState } from "../types/interaction.type";
import { persist } from "zustand/middleware";

const useInteractionStore = create(
  persist<InteractionState>(
    (set) => ({
      interaction: null,
      interactionList: [],
      loading: false,
      error: null,

      setInteraction: (interaction) => set({ interaction }),
      setInteractionList: (interactionList) => set({ interactionList }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    { name: "interaction-storage" } // key in localStorage
  )
);

export default useInteractionStore;
