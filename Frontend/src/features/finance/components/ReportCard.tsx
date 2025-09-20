import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { Delete, Description, Update } from "@mui/icons-material";

type ReportCardProps = {
  report?: any; // ideally define Report type
  onGenerate?: () => void;
  onSelect?: (id: number) => void; // emit report id on click
  onDelete?: (id: number) => void; // emit report id on delete
};

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onGenerate,
  onSelect,
  onDelete,
}) => {
  const [visible, setVisible] = useState(true);

  const handleGenerateClick = () => {
    setVisible(false);
    onGenerate?.();
  };

  if (!report && !visible) return null;

  if (!report) {
    return (
      <Card
        sx={{
          width: 320,
          mx: "auto",
          mt: 4,
          textAlign: "center",
          cursor: "pointer",
          borderRadius: 0,
          border: 1,
          borderColor: "primary.main",
          "&:hover": { boxShadow: 4, bgcolor: "grey.50" },
        }}
        onClick={handleGenerateClick}
      >
        <CardContent>
          <Description color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
            No report available
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            + Generate Report
          </Button>
        </CardContent>
      </Card>
    );
  }

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
        width: 320,
        mx: "auto",
        mt: 3,
        borderRadius: 0,
        border: 1,
        borderColor: "grey.300",
        "&:hover": { boxShadow: 6, bgcolor: "grey.50" },
        position: "relative",
      }}
    >
      <CardContent sx={{ cursor: "pointer" }} onClick={() => onSelect?.(id)}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Description color="primary" />
          <Typography variant="h6" fontWeight="bold">
            {reportType} Report
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Start: <strong>{periodStart}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            End: <strong>{periodEnd}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Updated: <strong>{updatedAt}</strong>
          </Typography>
        </Box>

        {/* Delete Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering onSelect
            onDelete?.(id);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "error.main",
          }}
        >
          <Delete />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
