import type { ApiResponse } from "../../../types/api-response.type";
import Api from "../api/reportsApi";

import { useReportStore } from "../store/reportStore";
import type { FindReportParams } from "../types/Reports.type";

export const useReports = () => {
  const {
    setReportsList,
    setReport,
    setError,
    setLoading,
    reportsList,
    report,
  } = useReportStore();

  const getAll = async (query = {}) => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const { data }: ApiResponse<Report[]> = await Api.getAll(query);
      setReportsList(data || []);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  const getOne = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Report> = await Api.getOne(id);
      setReport(data || null);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: FindReportParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data }: ApiResponse<Report> = await Api.create(payload);
      setReport(data || null);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    getAll,
    getOne,
    create,
  };
};
