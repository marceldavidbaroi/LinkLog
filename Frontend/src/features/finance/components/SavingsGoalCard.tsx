import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  Paper,
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { SavingsGoal } from "../types/SavingsGoals.type";
import type { Transaction } from "../types/Transaction.type";

const priorityColors: Record<string, "error" | "warning" | "success"> = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "success",
};

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onAddSavings?: (goalId: number, amount: number) => void;
  onEditGoal?: (goalId: number) => void;
  onDeleteGoal?: (goalId: number) => void;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transaction: Transaction) => void;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
  goal,
  onAddSavings,
  onEditGoal,
  onDeleteGoal,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [showTransactions, setShowTransactions] = useState(false);
  const [addingSavings, setAddingSavings] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [editingTransactionId, setEditingTransactionId] = useState<
    number | null
  >(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const savedAmount =
    typeof goal.savedAmount === "string"
      ? parseFloat(goal.savedAmount)
      : goal.savedAmount ?? 0;

  const targetAmount =
    typeof goal.targetAmount === "string"
      ? parseFloat(goal.targetAmount)
      : goal.targetAmount ?? 0;

  const canAddSavings = savedAmount < targetAmount;
  const hasTransactions = goal.transactions && goal.transactions.length > 0;

  const handleSave = () => {
    const amount = parseFloat(amountInput);
    if (!isNaN(amount) && amount > 0 && onAddSavings) {
      onAddSavings(goal.id, amount);
      setAmountInput("");
      setAddingSavings(false);
    }
  };

  const handleTransactionSave = (t: Transaction) => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount) && amount > 0 && onEditTransaction) {
      onEditTransaction({ ...t, amount }); // emit full transaction with new amount
      setEditingTransactionId(null);
      setEditAmount("");
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">{goal.name}</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => onEditGoal?.(goal.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDeleteGoal?.(goal.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Amounts */}
      <Stack direction="row" spacing={3} mb={2} mt={2}>
        <Box>
          <Typography variant="subtitle2">Target Amount</Typography>
          <Typography variant="h6">{targetAmount.toFixed(2)} Tk</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Saved Amount</Typography>
          <Typography variant="h6">{savedAmount.toFixed(2)} Tk</Typography>
        </Box>
      </Stack>

      {/* Priority & Due Date */}
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Chip
          label={goal.priority}
          color={priorityColors[goal.priority]}
          variant="outlined"
        />
        <Typography variant="body2" color="textSecondary">
          Due:{" "}
          {goal.dueDate
            ? new Date(goal.dueDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "-"}
        </Typography>
      </Stack>

      {/* Add Savings */}
      {canAddSavings && !addingSavings && (
        <Button
          variant="outlined"
          onClick={() => setAddingSavings(true)}
          sx={{ mb: 2 }}
        >
          Add Savings
        </Button>
      )}
      {addingSavings && (
        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            size="small"
            label="Amount"
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setAddingSavings(false);
              setAmountInput("");
            }}
          >
            Cancel
          </Button>
        </Stack>
      )}

      {/* Show Transactions Button */}
      {hasTransactions && (
        <Box mb={1}>
          <Button
            variant="contained"
            startIcon={
              showTransactions ? <ExpandLessIcon /> : <ExpandMoreIcon />
            }
            onClick={() => setShowTransactions((prev) => !prev)}
          >
            {showTransactions ? "Hide Transactions" : "View Transactions"}
          </Button>
        </Box>
      )}

      {/* Transactions Table */}
      {hasTransactions && (
        <Collapse in={showTransactions} timeout="auto" unmountOnExit>
          <Table sx={{ mt: 2 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount (Tk)</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {goal.transactions?.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    {t.date
                      ? new Date(t.date).toLocaleDateString("en-US")
                      : "-"}
                  </TableCell>
                  <TableCell>{t.type ?? "-"}</TableCell>
                  <TableCell>{t.category ?? "-"}</TableCell>
                  <TableCell align="right">
                    {editingTransactionId === t.id ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                      />
                    ) : t.amount != null ? (
                      `${t.amount} Tk`
                    ) : (
                      "0.00 Tk"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {editingTransactionId === t.id ? (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            const payload = {
                              transaction: {
                                ...t,
                                amount: parseFloat(editAmount),
                              },
                              goal,
                            };
                            onEditTransaction?.(payload);
                            setEditingTransactionId(null);
                            setEditAmount("");
                          }}
                          sx={{ mr: 1 }}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => setEditingTransactionId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingTransactionId(t.id);
                            setEditAmount(t.amount?.toString() || "");
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            onDeleteTransaction?.({ transaction: t, goal })
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Collapse>
      )}
    </Paper>
  );
};

export default SavingsGoalCard;
