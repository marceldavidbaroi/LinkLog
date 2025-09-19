import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { FindReportParams, ReportType } from "../types/Reports.type";

interface Props {
  onSearch: (params: FindReportParams) => void;
  onReset: () => void;
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const ReportFilterBar = ({ onSearch, onReset }: Props) => {
  const [type, setType] = useState<ReportType | "">("");
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [half, setHalf] = useState<number | "">("");

  const handleSearch = () => {
    const params: FindReportParams = {};
    if (type) params.reportType = type as ReportType;
    if (year) params.year = Number(year);
    if (month) params.month = Number(month);
    if (half) params.half = Number(half);

    onSearch(params);
  };

  const handleReset = () => {
    setType("");
    setYear("");
    setMonth("");
    setHalf("");
    onReset();
  };

  const isSearchDisabled =
    !type ||
    (type === "monthly" && (!year || !month)) ||
    (type === "half_yearly" && (!year || !half)) ||
    (type === "yearly" && !year);

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      flexWrap="wrap"
      p={2}
      sx={{ backgroundColor: "#fafafa", borderRadius: 2 }}
    >
      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel>Type</InputLabel>
        <Select
          value={type}
          label="Type"
          onChange={(e) => {
            const newType = e.target.value as ReportType;
            setType(newType);
            // reset dependent fields
            setYear("");
            setMonth("");
            setHalf("");
          }}
        >
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="half_yearly">Half-Yearly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </FormControl>

      {(type === "monthly" || type === "half_yearly" || type === "yearly") && (
        <TextField
          label="Year"
          type="number"
          size="small"
          value={year}
          onChange={(e) =>
            setYear(e.target.value ? Number(e.target.value) : "")
          }
        />
      )}

      {type === "monthly" && (
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Month</InputLabel>
          <Select
            value={month}
            label="Month"
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {type === "half_yearly" && (
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Half</InputLabel>
          <Select
            value={half}
            label="Half"
            onChange={(e) => setHalf(Number(e.target.value))}
          >
            <MenuItem value={1}>First Half</MenuItem>
            <MenuItem value={2}>Second Half</MenuItem>
          </Select>
        </FormControl>
      )}

      <Button
        variant="contained"
        color="primary"
        disabled={isSearchDisabled}
        onClick={handleSearch}
        size="small"
      >
        Search
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleReset}
        size="small"
      >
        Reset
      </Button>
    </Box>
  );
};

export default ReportFilterBar;
