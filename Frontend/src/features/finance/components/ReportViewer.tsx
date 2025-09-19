import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";

type ReportProps = {
  report: any; // ideally replace with a proper TypeScript interface
};

const ReportViewer: React.FC<ReportProps> = ({ report }) => {
  const data = report?.data ?? {};

  return (
    <Box sx={{ p: 2 }}>
      {/* Report Header */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {report?.reportType?.toUpperCase() ?? "REPORT"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.period?.start ?? "-"} → {data.period?.end ?? "-"}
          </Typography>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography>Total Income</Typography>
              <Typography fontWeight="bold">
                ${data.summary?.totalIncome ?? 0}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Total Expense</Typography>
              <Typography fontWeight="bold">
                ${data.summary?.totalExpense ?? 0}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Net Savings</Typography>
              <Typography fontWeight="bold">
                ${data.summary?.netSavings ?? 0}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Budgeted</Typography>
              <Typography fontWeight="bold">
                ${data.summary?.budgetedAmount ?? 0}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography>
            Savings Goal Progress:{" "}
            {data.summary?.savingsProgress?.percentage ?? 0}%
          </Typography>
        </CardContent>
      </Card>

      {/* Income */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Income by Category
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.income?.byCategory?.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{item.category ?? "-"}</TableCell>
                  <TableCell>${item.amount ?? 0}</TableCell>
                  <TableCell>{item.percentage ?? 0}%</TableCell>
                </TableRow>
              )) || (
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
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Expenses by Category
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.expenses?.byCategory?.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{item.category ?? "-"}</TableCell>
                  <TableCell>${item.amount ?? 0}</TableCell>
                  <TableCell>{item.percentage ?? 0}%</TableCell>
                </TableRow>
              )) || (
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
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Budgets by Category
          </Typography>
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
              {data.budgets?.byCategory?.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{item.category ?? "-"}</TableCell>
                  <TableCell>${item.budgeted ?? 0}</TableCell>
                  <TableCell>${item.spent ?? 0}</TableCell>
                  <TableCell>{item.percentageUsed ?? 0}%</TableCell>
                </TableRow>
              )) || (
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
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Savings Goals
          </Typography>
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
              {data.savingsGoals?.map((goal: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{goal.goalName ?? "-"}</TableCell>
                  <TableCell>{goal.status ?? "-"}</TableCell>
                  <TableCell>${goal.saved_amount ?? 0}</TableCell>
                  <TableCell>${goal.target_amount ?? 0}</TableCell>
                  <TableCell>{goal.percentage ?? 0}%</TableCell>
                  <TableCell>{goal.due_date ?? "-"}</TableCell>
                </TableRow>
              )) || (
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
