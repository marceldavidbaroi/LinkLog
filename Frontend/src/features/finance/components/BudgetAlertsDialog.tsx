import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

// Types
export interface Budget {
  id: number;
  category: string;
  amount: string;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetAlert {
  budget: Budget;
  spent: number;
  limitReached: boolean;
  percentageUsed: number;
}

interface BudgetAlertsDialogProps {
  alerts: BudgetAlert[];
}

// Helper to convert month number to name
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const BudgetAlertsDialog: React.FC<BudgetAlertsDialogProps> = ({ alerts }) => {
  const [open, setOpen] = useState(false);

  if (alerts.length === 0) return null;

  // Assuming all alerts are for the same month/year
  const alertMonth = alerts[0].budget.month;
  const alertYear = alerts[0].budget.year;
  const monthYearLabel = `${monthNames[alertMonth - 1]} ${alertYear}`;

  return (
    <>
      {/* Button to open dialog, right-aligned */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 0, fontWeight: "bold", px: 2, py: 1 }}
        >
          View Budget Alerts ({alerts.length})
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Budget Alerts</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {monthYearLabel}
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Spent</TableCell>
                <TableCell>Usage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.budget.id}>
                  <TableCell>
                    {alert.budget.category.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>{alert.budget.amount}</TableCell>
                  <TableCell>{alert.spent}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: alert.limitReached ? "error.main" : "primary.main",
                    }}
                  >
                    {(alert.percentageUsed * 100).toFixed(0)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BudgetAlertsDialog;
