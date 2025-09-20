import { useEffect, useState } from "react";
import { useReports } from "../hooks/reportsAuth";
import { useReportStore } from "../store/reportStore";
import ReportViewer from "../components/ReportViewer";
import ReportCard from "../components/ReportCard";
import { useNavigate } from "react-router-dom";
import ReportFilterBar from "../components/ReportFilterBar";
import type { FindReportParams } from "../types/Reports.type";
import { Button, Box } from "@mui/material";
import DeleteDialog from "../../../components/DeleteDialog";
import TopCategoriesCard from "../components/TopCategoriesCard";
import CategoryOverviewChart from "../components/CategoryOverviewChart";

const ReportsIndex = () => {
  const reportStore = useReportStore();
  const { getAll, create, remove, topCategories, categoryCharts } =
    useReports();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FindReportParams>();
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();
  const [topData, setTopData] = useState();
  const [chartData, setChartData] = useState();

  const fetchAll = async (query: FindReportParams) => {
    const data = await getAll(query);
    console.log(data);
  };

  useEffect(() => {
    reportStore.setReportsList([]);
    reportStore.setReport(null);
  }, []);

  const handleSelect = (id: number) => {
    navigate(`/finance/reports/${id}`); // ✅ redirect to report details page
  };

  const handleGenerate = async () => {
    if (filters) {
      await create(filters);
      await fetchAll(filters);
    }
  };

  const handleSearch = async (filters: FindReportParams) => {
    console.log(filters);
    setFilters(filters);
    fetchAll(filters);
    const payload = {
      year: Number(filters.year) || null,
      month: Number(filters.month) || null,
    };
    const topData = await topCategories(payload);
    if (topData) {
      setTopData(topData);
    }
    const chartData = await categoryCharts(payload);
    console.log(chartData);
    if (chartData) {
      setChartData(chartData);
    }
  };

  const handleReset = () => {
    setFilters(undefined);
  };
  const handleDelete = (id: number) => {
    setSelectedId(id);
    setDialogDeleteOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (selectedId) await remove(selectedId);
  };
  return (
    <>
      <ReportFilterBar onSearch={handleSearch} onReset={handleReset} />
      <TopCategoriesCard data={topData} />
      {reportStore.reportsList.length > 0
        ? reportStore.reportsList.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          ))
        : filters && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
              >
                Generate Report
              </Button>
            </Box>
          )}
      <CategoryOverviewChart data={chartData} />
      <DeleteDialog
        open={dialogDeleteOpen}
        onCancel={() => setDialogDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />{" "}
    </>
  );
};

export default ReportsIndex;
