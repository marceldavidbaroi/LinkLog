import { useEffect, useState } from "react";
import { useReports } from "../hooks/reportsAuth";
import { useReportStore } from "../store/reportStore";
import ReportViewer from "../components/ReportViewer";
import ReportCard from "../components/ReportCard";
import { useNavigate } from "react-router-dom";
import ReportFilterBar from "../components/ReportFilterBar";
import type { FindReportParams } from "../types/Reports.type";

const ReportsIndex = () => {
  const reportStore = useReportStore();
  const { getAll, create } = useReports();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FindReportParams>();

  const fetchAll = async (query: FindReportParams) => {
    const data = await getAll(query);
    console.log(data);
  };
  useEffect(() => {
    reportStore.reportsList = [];
  }, []);

  const handleSelect = (id: number) => {
    navigate(`/finance/reports/${id}`); // ✅ redirect to report details page
  };
  const handleGenerate = async () => {
    if (filters) {
      await create(filters);
    }
  };

  const handleSearch = (filters: FindReportParams) => {
    console.log(filters);
    setFilters(filters);
    fetchAll(filters);
  };
  const handleReset = () => {
    console.log("Filters cleared");
  };
  return (
    <>
      <ReportFilterBar onSearch={handleSearch} onReset={handleReset} />

      {reportStore.reportsList.length > 0 ? (
        reportStore.reportsList.map((report) => (
          <ReportCard key={report.id} report={report} onSelect={handleSelect} />
        ))
      ) : (
        <ReportCard onGenerate={handleGenerate} />
      )}
      {reportStore.report && <ReportViewer report={reportStore.report} />}
    </>
  );
};
export default ReportsIndex;
