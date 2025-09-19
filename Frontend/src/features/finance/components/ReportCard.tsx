import React from "react";
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
  if (!report) {
    return (
      <Card
        sx={{
          p: 1,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": { boxShadow: 4 },
        }}
        onClick={onGenerate}
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

  return (
    <Card
      sx={{
        mb: 1,
        cursor: "pointer",
        "&:hover": { boxShadow: 4, bgcolor: "grey.50" },
      }}
      onClick={() => onSelect?.(report.id)}
    >
      <CardContent sx={{ p: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {report.report_type.toUpperCase()} Report
        </Typography>

        <Box>
          <Typography variant="caption" color="text.secondary" display="block">
            Start: <strong>{report.period_start}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            End: <strong>{report.period_end}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Updated:{" "}
            <strong>{new Date(report.updated_at).toLocaleDateString()}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
