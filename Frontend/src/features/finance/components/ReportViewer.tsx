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
  report: any; // ideally define a proper TypeScript interface
};

const ReportViewer: React.FC<ReportProps> = ({ report }) => {
  const data = report.data;

  return (
    <Box sx={{ p: 2 }}>
      {/* Report Header */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {report?.report_type?.toUpperCase()} Report
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.period.start} → {data.period.end}
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
                ${data.summary.total_income}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Total Expense</Typography>
              <Typography fontWeight="bold">
                ${data.summary.total_expense}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Net Savings</Typography>
              <Typography fontWeight="bold">
                ${data.summary.net_savings}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography>Budgeted</Typography>
              <Typography fontWeight="bold">
                ${data.summary.budgeted_amount}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography>
            Savings Goal Progress: {data.summary?.savings_progress?.percentage}%
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
              {data.income.by_category.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.amount}</TableCell>
                  <TableCell>{item.percentage}%</TableCell>
                </TableRow>
              ))}
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
              {data.expenses.by_category.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.amount}</TableCell>
                  <TableCell>{item.percentage}%</TableCell>
                </TableRow>
              ))}
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
              {data.budgets.by_category.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.budgeted}</TableCell>
                  <TableCell>${item.spent}</TableCell>
                  <TableCell>{item.percentage_used}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Divider sx={{ my: 2 }} />
          <Typography>
            Overall Budget Usage: {data.budgets.overall_usage.percentage_used}%
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
              {data.savings_goals.map((goal: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{goal.goal_name}</TableCell>
                  <TableCell>{goal.status}</TableCell>
                  <TableCell>${goal.saved_amount}</TableCell>
                  <TableCell>${goal.target_amount}</TableCell>
                  <TableCell>{goal.percentage}%</TableCell>
                  <TableCell>{goal.due_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportViewer;
