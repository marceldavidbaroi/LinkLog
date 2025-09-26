"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Stack,
  MenuItem,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import {
  type TransactionType,
  type BulkTransactionPayload,
  type TransactionItem,
  transactionTypes,
  incomeCategoriesList,
  expenseCategoriesList,
} from "@/features/finance/types/Transaction.type"; // adjust path

type BulkTransactionDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: BulkTransactionPayload) => void;
};

const BulkTransactionDialog: React.FC<BulkTransactionDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [date, setDate] = useState<Dayjs | null>(dayjs()); // default current date
  const [type, setType] = useState<TransactionType>("income");
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    { category: incomeCategoriesList[0], amount: 0 },
  ]);

  const categories =
    type === "income" ? incomeCategoriesList : expenseCategoriesList;

  const handleAddTransaction = () => {
    setTransactions([...transactions, { category: categories[0], amount: 0 }]);
  };

  const handleRemoveTransaction = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const handleTransactionChange = (
    index: number,
    field: keyof TransactionItem,
    value: string | number
  ) => {
    const updated = [...transactions];
    updated[index][field] =
      field === "amount" ? Number(value) : (value as string);
    setTransactions(updated);
  };

  const handleSave = () => {
    if (!date) return;
    onSave({
      date: date.toISOString(),
      type,
      transactions,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* FIXED: No nested <h6> */}
      <DialogTitle>Bulk Transactions</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {/* FIXED: Wrap DatePicker in LocalizationProvider */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <TextField
            select
            label="Transaction Type"
            value={type}
            onChange={(e) => {
              const newType = e.target.value as TransactionType;
              setType(newType);
              // reset first transaction category when type changes
              setTransactions([
                {
                  category:
                    newType === "income"
                      ? incomeCategoriesList[0]
                      : expenseCategoriesList[0],
                  amount: 0,
                },
              ]);
            }}
            fullWidth
          >
            {transactionTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          {transactions.map((t, index) => (
            <Stack direction="row" spacing={2} key={index} alignItems="center">
              <TextField
                select
                label="Category"
                value={t.category}
                onChange={(e) =>
                  handleTransactionChange(index, "category", e.target.value)
                }
                fullWidth
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Amount"
                type="number"
                value={t.amount}
                onChange={(e) =>
                  handleTransactionChange(index, "amount", e.target.value)
                }
                fullWidth
              />

              <IconButton
                color="error"
                onClick={() => handleRemoveTransaction(index)}
                disabled={transactions.length === 1}
              >
                <Delete />
              </IconButton>
            </Stack>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddTransaction}
          >
            Add Transaction
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkTransactionDialog;
