import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  useTheme,
} from "@mui/material";

type OverviewType = {
  prev: number;
  current: number;
  percentage: number;
};

type DetailsType = {
  category: string;
  type: "income" | "expense";
  prev: number;
  current: number;
  percentage: number;
};

interface MonthlyComparisonProps {
  data: {
    overview: {
      income: OverviewType;
      expense: OverviewType;
      savings: OverviewType;
    };
    details: DetailsType[];
  };
}

const MonthlyComparison: React.FC<MonthlyComparisonProps> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const theme = useTheme(); // for theme-aware text

  const cardColors: Record<string, string> = {
    income: "#e3f2fd", // soft blue
    expense: "#ffebee", // soft red
    savings: "#e8f5e9", // soft green
  };

  const rowColors: Record<string, string> = {
    income: "#f1f8ff", // lighter blue
    expense: "#fff0f0", // lighter red
  };

  const calcPercentageColor = (percentage: number) => {
    if (percentage > 0) return "green";
    if (percentage < 0) return "red";
    return "gray";
  };

  const handleCardClick = () => {
    setExpanded((prev) => !prev);
    setShowDetails(false);
  };

  return (
    <Box>
      {/* Theme-aware Title */}
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        sx={{ color: theme.palette.text.primary, textAlign: "center" }}
      >
        Comparison Between Last and Current Month
      </Typography>

      {/* Overview Cards */}
      <Box display="flex" gap={2} mb={2}>
        {Object.entries(data.overview).map(([key, value]) => (
          <Card
            key={key}
            sx={{
              flex: 1,
              cursor: "pointer",
              bgcolor: cardColors[key],
              borderRadius: 2,
              boxShadow: 1,
              transition: "all 0.3s ease",
            }}
            onClick={handleCardClick}
          >
            <CardContent
              sx={{
                textAlign: "center",
                p: expanded ? 2 : 0.5,
                "&:last-child": { pb: expanded ? 2 : 0.5 },
              }}
            >
              <Typography
                variant={expanded ? "subtitle1" : "caption"}
                sx={{
                  textTransform: "capitalize",
                  fontWeight: expanded ? "normal" : "bold",
                  color: "#000",
                }}
              >
                {key}
              </Typography>
              <Typography
                variant={expanded ? "h5" : "caption"}
                fontWeight="bold"
                sx={{ color: calcPercentageColor(value.percentage) }}
              >
                {value.percentage.toFixed(1)}%
              </Typography>

              <Collapse in={expanded}>
                <Box mt={1}>
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    Prev: <strong>{value.prev}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#000" }}>
                    Current: <strong>{value.current}</strong>
                  </Typography>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Show Details Button - only when expanded */}
      {expanded && (
        <Box textAlign="right" mb={2}>
          <Button
            variant="contained"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
        </Box>
      )}

      {/* Details Table */}
      <Collapse in={showDetails}>
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 1, mb: 4 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
                <TableCell sx={{ color: "#fff" }}>Category</TableCell>
                <TableCell sx={{ color: "#fff" }}>Type</TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  Prev
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  Current
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  Percentage
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.details.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ bgcolor: rowColors[row.type] || "transparent" }}
                >
                  <TableCell sx={{ color: "#000" }}>{row.category}</TableCell>
                  <TableCell sx={{ color: "#000" }}>{row.type}</TableCell>
                  <TableCell align="right" sx={{ color: "#000" }}>
                    {row.prev}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#000" }}>
                    {row.current}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: calcPercentageColor(row.percentage),
                      fontWeight: "bold",
                    }}
                  >
                    {row.percentage.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
};

export default MonthlyComparison;
