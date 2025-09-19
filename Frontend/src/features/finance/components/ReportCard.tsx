import React, { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

type ReportCardProps = {
  report?: any; // ideally define Report type
  onGenerate?: () => void;
  onSelect?: (id: number) => void; // emit report id on click
};

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onGenerate,
  onSelect,
}) => {
  const [visible, setVisible] = useState(true); // state to hide the generate card

  const handleGenerateClick = () => {
    setVisible(false); // hide the card
    onGenerate?.(); // call passed function
  };

  // If no report and the generate card has been hidden
  if (!report && !visible) return null;

  if (!report) {
    return (
      <Card
        sx={{
          p: 1,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": { boxShadow: 4 },
        }}
        onClick={handleGenerateClick}
      >
        <CardContent sx={{ p: 1 }}>
          <Typography variant="body2" gutterBottom>
            No report available
          </Typography>
          <Typography
            variant="button"
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            + Generate Report
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Safety checks for report fields
  const id = report?.id ?? 0;
  const reportType = report?.reportType?.toUpperCase() ?? "UNKNOWN";
  const periodStart = report?.periodStart ?? "N/A";
  const periodEnd = report?.periodEnd ?? "N/A";
  const updatedAt = report?.updatedAt
    ? new Date(report.updatedAt).toLocaleDateString()
    : "N/A";

  return (
    <Card
      sx={{
        mb: 1,
        cursor: "pointer",
        "&:hover": { boxShadow: 4, bgcolor: "grey.50" },
      }}
      onClick={() => onSelect?.(id)}
    >
      <CardContent sx={{ p: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {reportType} Report
        </Typography>

        <Box>
          <Typography variant="caption" color="text.secondary" display="block">
            Start: <strong>{periodStart}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            End: <strong>{periodEnd}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Updated: <strong>{updatedAt}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
