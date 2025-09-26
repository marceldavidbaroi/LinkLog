"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";

import {
  Category as CategoryIcon,
  Event as DateIcon,
  Repeat as RecurringIcon,
  Schedule as IntervalIcon,
  Description as DescriptionIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import type { Transaction } from "@/features/finance/types/Transaction.type";

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionDialog = ({
  open,
  onClose,
  transaction,
}: TransactionDialogProps) => {
  if (!transaction) return null;

  const formattedDate = format(new Date(transaction.date), "dd-MM-yyyy");
  const isIncome = transaction.type === "income";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {/* Title with color + icon */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // center the title
          gap: 1,
          color: isIncome ? "success.main" : "error.main",
        }}
      >
        {isIncome ? <IncomeIcon /> : <ExpenseIcon />}
        {isIncome ? "Income" : "Expense"}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* Amount */}
          <Grid item xs={12} component="div">
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography
                variant="h4"
                fontWeight="bold"
                color={isIncome ? "success.main" : "error.main"}
              >
                {transaction.amount} Tk
              </Typography>
            </Box>
          </Grid>

          {/* Details */}
          <Grid item xs={12} component="div">
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              alignItems="flex-start"
            >
              {/* Category */}
              <Box display="flex" alignItems="center" gap={1}>
                <CategoryIcon color="primary" />
                <Typography>{transaction.category}</Typography>
              </Box>

              {/* Date */}
              <Box display="flex" alignItems="center" gap={1}>
                <DateIcon color="action" />
                <Typography>{formattedDate}</Typography>
              </Box>

              {/* Recurring */}
              <Box display="flex" alignItems="center" gap={1}>
                <RecurringIcon
                  color={transaction.recurring ? "success" : "disabled"}
                />
                <Typography>
                  {transaction.recurring ? "Recurring" : "One-time"}
                </Typography>
              </Box>

              {/* Interval */}
              {transaction.recurring && (
                <Box display="flex" alignItems="center" gap={1}>
                  <IntervalIcon color="info" />
                  <Typography>{transaction.recurringInterval}</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Description */}
        {transaction.description && (
          <Box
            mt={2}
            display="flex"
            alignItems="center"
            gap={1}
            justifyContent="center"
          >
            <DescriptionIcon color="action" />
            <Typography textAlign="center">
              {transaction.description}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end" }}>
        <Button onClick={onClose} variant="text" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDialog;
