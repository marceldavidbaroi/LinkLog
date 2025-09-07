import { create } from "zustand";
import type { ContactState } from "../types/contact.type";
import { persist } from "zustand/middleware";

const useContactStore = create(
  persist<ContactState>(
    (set) => ({
      person: null,
      contactList: [],
      loading: false,
      error: null,

      setPerson: (person) => set({ person }),
      setContactList: (contactList) => set({ contactList }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    { name: "person-storage" } // key in localStorage
  )
);

export default useContactStore;
