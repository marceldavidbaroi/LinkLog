import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TransactionsState } from "../types/Transaction.type";

export const useTransactionsStore = create(
  persist<TransactionsState>(
    (set) => ({
      transactionList: [],
      transaction: null,
      loading: false,
      error: null,

      setTransactionList: (transactionList) => set({ transactionList }),
      setTransaction: (transaction) => set({ transaction }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "transactions-storage", // storage key
    }
  )
);
