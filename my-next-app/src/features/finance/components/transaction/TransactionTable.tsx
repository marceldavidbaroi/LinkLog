"use client";

import { useState, useEffect } from "react";

import {
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  IconButton,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import TransactionDialog from "./TransactionDetailsDialog";
import TransactionFormDialog from "./TransactionFormDialog";
import DeleteDialog from "@/components/DeleteDialog";
import BulkTransactionDialog from "./BulkTransactionDialog";
import { useTransactions } from "@/features/finance/hooks/transactionsAuth";
import { useTransactionsStore } from "@/features/finance/store/transactionsStore";
import { formatDate } from "@/lib/utils";

import {
  type Transaction,
  type TransactionType,
  incomeCategoriesList,
  expenseCategoriesList,
  type FindTransactionsParams,
  type BulkTransactionPayload,
} from "@/features/finance/types/Transaction.type";

export default function TransactionTable() {
  const transactionStore = useTransactionsStore();
  const { getAll, getById, create, update, remove, bulk } = useTransactions();

  const [pagination, setPagination] = useState({ page: 0, pageSize: 25 });
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState<FindTransactionsParams>({});

  const [dialogFormOpen, setDialogFormOpen] = useState(false);
  const [dialogDetailsOpen, setDialogDetailsOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);

  const fetchTransactions = async () => {
    const query: FindTransactionsParams = {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.startDate ? { startDate: filters.startDate } : {}),
      ...(filters.endDate ? { endDate: filters.endDate } : {}),
    };
    const response = await getAll(query);
    transactionStore.setTransactionList(response?.data || []);
    setTotalRows(response?.meta?.total || 0);
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, pagination.page, pagination.pageSize]);

  const handleAdd = () => {
    setEditingTransaction(null);
    setDialogFormOpen(true);
  };

  const handleEditClick = async (id: number) => {
    const transaction = await getById(id);
    if (!transaction) return;
    setEditingTransaction(transaction);
    setDialogFormOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Transaction>) => {
    if (editingTransaction) {
      await update(editingTransaction.id, data);
    } else {
      await create(data);
    }
    setDialogFormOpen(false);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleDeleteClick = (id: number) => {
    setSelectedTransactionId(id);
    setDialogDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTransactionId) {
      await remove(selectedTransactionId);
      setDialogDeleteOpen(false);
      setSelectedTransactionId(null);
      fetchTransactions();
    }
  };

  const handleShowDetails = async (id: number) => {
    const transaction = await getById(id);
    if (!transaction) return;
    setEditingTransaction(transaction);
    setDialogDetailsOpen(true);
  };

  const handleBulkSave = async (data: BulkTransactionPayload) => {
    await bulk(data);
    setBulkDialogOpen(false);
    fetchTransactions();
  };

  const handleTypeChange = (e: any) => {
    setFilters({
      ...filters,
      type: e.target.value as TransactionType,
      category: undefined,
    });
    setPagination({ ...pagination, page: 0 });
  };

  const handleCategoryChange = (e: any) => {
    setFilters({ ...filters, category: e.target.value });
    setPagination({ ...pagination, page: 0 });
  };

  const handleStartDateChange = (date: Date | null) => {
    setFilters({ ...filters, startDate: date?.toISOString() });
    setPagination({ ...pagination, page: 0 });
  };

  const handleEndDateChange = (date: Date | null) => {
    setFilters({ ...filters, endDate: date?.toISOString() });
    setPagination({ ...pagination, page: 0 });
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({ page: 0, pageSize: parseInt(e.target.value, 10) });
  };

  return (
    <Paper
      sx={{
        width: "100%",
        p: 2,
        boxShadow: "none",
        bgcolor: "transparent", // transparent background
      }}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
        my={2}
        flexWrap="wrap"
        gap={1}
      >
        {JSON.stringify(transactionStore.transactionList)}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          startIcon={<AddIcon />}
        >
          Add Transaction
        </Button>
        <Button variant="outlined" onClick={() => setBulkDialogOpen(true)}>
          Add Bulk Transactions
        </Button>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box display="flex" gap={1} mb={2} flexWrap="wrap" alignItems="center">
          <FormControl sx={{ minWidth: 130 }} size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type || ""}
              label="Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category || ""}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All</MenuItem>
              {filters.type === "income"
                ? incomeCategoriesList.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))
                : filters.type === "expense"
                ? expenseCategoriesList.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))
                : [...incomeCategoriesList, ...expenseCategoriesList].map(
                    (cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    )
                  )}
            </Select>
          </FormControl>

          <DatePicker
            label="Start Date"
            value={filters.startDate ? new Date(filters.startDate) : null}
            onChange={handleStartDateChange}
            slotProps={{
              textField: { size: "small" },
              actionBar: { actions: ["clear"] },
            }}
          />
          <DatePicker
            label="End Date"
            value={filters.endDate ? new Date(filters.endDate) : null}
            onChange={handleEndDateChange}
            slotProps={{
              textField: { size: "small" },
              actionBar: { actions: ["clear"] },
            }}
          />
        </Box>
      </LocalizationProvider>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              {[
                "Date",
                "Type",
                "Category",
                "Description",
                "Recurring",
                "Interval",
                "Amount",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {transactionStore.loading
              ? Array.from({ length: pagination.pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : transactionStore.transactionList.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("button")) return;
                      handleShowDetails(row.id);
                    }}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 2,
                      mb: 1,
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                    }}
                  >
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.category.displayName}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.recurring ? "Yes" : "No"}</TableCell>
                    <TableCell>{row.recurringInterval}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          row.type === "expense"
                            ? "error.main"
                            : "success.main",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      {Number(row.amount).toFixed(2)} Tk
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(row.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalRows}
        page={pagination.page}
        onPageChange={handleChangePage}
        rowsPerPage={pagination.pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Dialogs */}
      <TransactionDialog
        open={dialogDetailsOpen}
        transaction={editingTransaction}
        onClose={() => setDialogDetailsOpen(false)}
      />
      <TransactionFormDialog
        open={dialogFormOpen}
        transaction={editingTransaction}
        onClose={() => {
          setEditingTransaction(null);
          setDialogFormOpen(false);
        }}
        onSubmit={handleFormSubmit}
      />
      <DeleteDialog
        open={dialogDeleteOpen}
        onCancel={() => setDialogDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <BulkTransactionDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        onSave={handleBulkSave}
      />
    </Paper>
  );
}
