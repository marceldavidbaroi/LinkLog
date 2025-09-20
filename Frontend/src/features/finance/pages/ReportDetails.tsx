import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReports } from "../hooks/reportsAuth";
import { useReportStore } from "../store/reportStore";
import ReportViewer from "../components/ReportViewer";
const ReportsDetails = () => {
  const { id } = useParams<{ id: string }>(); // get id from route
  const reportStore = useReportStore();
  const { getOne, update } = useReports();
  const fetchReport = async () => {
    if (id) {
      await getOne(Number(id));
    }
  };
  useEffect(() => {
    fetchReport();
  }, []);

  const handleUpdate = async () => {
    if (id) {
      await update(Number(id));
      await fetchReport();
    }
  };

  return (
    <>
      {reportStore.report ? (
        <ReportViewer report={reportStore.report} onUpdate={handleUpdate} />
      ) : (
        <p>Loading report...</p>
      )}
    </>
  );
};

export default ReportsDetails;
