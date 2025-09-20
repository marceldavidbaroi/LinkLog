import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Button,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Savings,
  PieChart,
  Assignment,
  Update,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type ReportProps = {
  report: any; // Replace with your proper type
  onUpdate?: (reportId: number) => void;
};

const ReportViewer: React.FC<ReportProps> = ({ report, onUpdate }) => {
  const data = report?.data ?? {};
  const updatedAt = report?.updatedAt ? new Date(report.updatedAt) : null;
  const now = new Date();
  const showUpdate = updatedAt && updatedAt < now;

  const navigate = useNavigate();

  const formatCurrency = (val: number) =>
    `Tk ${val?.toLocaleString("en-BD") ?? 0}`;

  const handlePrintRedirect = () => {
    navigate(`/reports/print?id=${report.id}`);
  };

  return (
    <Box
      className="report-print-container"
      sx={{ p: 2, maxWidth: "900px", mx: "auto", backgroundColor: "white" }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          borderBottom: "3px solid",
          borderColor: "primary.main",
          pb: 1,
        }}
      >
        <Typography variant="h5" color="primary" fontWeight="bold">
          {report?.reportType?.toUpperCase() ?? "REPORT"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.period?.start ?? "-"} → {data.period?.end ?? "-"}
        </Typography>
        {showUpdate && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Update />}
            size="small"
            sx={{ mt: 1 }}
            onClick={() => onUpdate?.(report.id)}
          >
            Update Report
          </Button>
        )}
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ mt: 1, ml: 1 }}
          onClick={handlePrintRedirect}
        >
          Print Report
        </Button>
      </Box>

      {/* Summary */}
      <Card
        className="print-section"
        variant="outlined"
        sx={{ mb: 3, borderRadius: 0 }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={4}>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp color="primary" />
                <Typography>Total Income</Typography>
              </Box>
              <Typography fontWeight="bold" color="success.main">
                {formatCurrency(data.summary?.totalIncome ?? 0)}
              </Typography>
            </Box>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingDown color="primary" />
                <Typography>Total Expense</Typography>
              </Box>
              <Typography fontWeight="bold" color="error.main">
                {formatCurrency(data.summary?.totalExpense ?? 0)}
              </Typography>
            </Box>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Savings color="primary" />
                <Typography>Net Savings</Typography>
              </Box>
              <Typography fontWeight="bold" color="info.main">
                {formatCurrency(data.summary?.netSavings ?? 0)}
              </Typography>
            </Box>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <AccountBalance color="primary" />
                <Typography>Budgeted</Typography>
              </Box>
              <Typography fontWeight="bold" color="warning.main">
                {formatCurrency(data.summary?.budgetedAmount ?? 0)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Income */}
      <Card
        className="print-section"
        variant="outlined"
        sx={{ mb: 3, borderRadius: 0 }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PieChart color="primary" />
            <Typography variant="h6">Income by Category</Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.income?.byCategory?.length ? (
                data.income.byCategory.map((item: any, idx: number) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor:
                        idx % 2 === 0 ? "action.hover" : "background.default",
                    }}
                  >
                    <TableCell>{item.category ?? "-"}</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="success.main">
                        {formatCurrency(item.amount ?? 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.percentage ?? 0}%</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No income data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expenses */}
      <Card
        className="print-section"
        variant="outlined"
        sx={{ mb: 3, borderRadius: 0 }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PieChart color="primary" />
            <Typography variant="h6">Expenses by Category</Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.expenses?.byCategory?.length ? (
                data.expenses.byCategory.map((item: any, idx: number) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor:
                        idx % 2 === 0 ? "action.hover" : "background.default",
                    }}
                  >
                    <TableCell>{item.category ?? "-"}</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="error.main">
                        {formatCurrency(item.amount ?? 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.percentage ?? 0}%</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No expense data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Budgets */}
      <Card
        className="print-section"
        variant="outlined"
        sx={{ mb: 3, borderRadius: 0 }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Assignment color="primary" />
            <Typography variant="h6">Budgets by Category</Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Budgeted</TableCell>
                <TableCell>Spent</TableCell>
                <TableCell>Used %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.budgets?.byCategory?.length ? (
                data.budgets.byCategory.map((item: any, idx: number) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor:
                        idx % 2 === 0 ? "action.hover" : "background.default",
                    }}
                  >
                    <TableCell>{item.category ?? "-"}</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="warning.main">
                        {formatCurrency(item.budgeted ?? 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="error.main">
                        {formatCurrency(item.spent ?? 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.percentageUsed ?? 0}%</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No budget data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Divider sx={{ my: 2 }} />
          <Typography>
            Overall Budget Usage:{" "}
            {data.budgets?.overallUsage?.percentageUsed ?? 0}%
          </Typography>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <Card
        className="print-section"
        variant="outlined"
        sx={{ mb: 3, borderRadius: 0 }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Savings color="primary" />
            <Typography variant="h6">Savings Goals</Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Goal</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Saved</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>Progress %</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.savingsGoals?.length ? (
                data.savingsGoals.map((goal: any, idx: number) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor:
                        idx % 2 === 0 ? "action.hover" : "background.default",
                    }}
                  >
                    <TableCell>{goal.goalName ?? "-"}</TableCell>
                    <TableCell>{goal.status ?? "-"}</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="info.main">
                        {formatCurrency(goal.savedAmount ?? 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="warning.main">
                        {formatCurrency(goal.targetAmount ?? 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>{goal.percentage ?? 0}%</TableCell>
                    <TableCell>{goal.dueDate ?? "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No savings goals
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportViewer;
