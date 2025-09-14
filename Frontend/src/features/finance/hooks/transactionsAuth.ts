import type { ApiResponse } from "../../../types/api-response.type";
import Api from "../api/transactionsApi";
import { useTransactionsStore } from "../store/transactionsStore";
import type {
  Transaction,
  TransactionSummary,
} from "../types/Transaction.type";

export const useTransactions = () => {
  const {
    setTransaction,
    setLoading,
    setError,
    transactionList,
    setTransactionList,
    setTransactionSummary,
  } = useTransactionsStore();

  /** Create a new transaction */
  const create = async (payload: Partial<Transaction>) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Transaction> = await Api.create(payload);
      setTransaction(data || null);

      if (data) setTransactionList([data, ...transactionList]);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch all transactions */
  const getAll = async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Transaction[]> = await Api.getAll(query);
      setTransactionList(data?.data || []);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch transaction by ID */
  const getById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Transaction> = await Api.getOne(id);
      setTransaction(data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Update transaction */
  const update = async (id: number, payload: Partial<Transaction>) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Transaction> = await Api.update({
        id,
        payload,
      });
      setTransaction(data || null);

      if (data) {
        const updatedList = transactionList.map((t) =>
          t.id === id ? data : t
        );
        setTransactionList(updatedList);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Delete transaction */
  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await Api.remove(id);
      setTransactionList(transactionList.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    getAll,
    getById,
    update,
    remove,
  };
};
