import { useEffect, useState } from "react";
import { useTransactions } from "../hooks/transactionsAuth";
import { useTransactionsStore } from "../store/transactionsStore";
import { Add as AddIcon } from "@mui/icons-material";

import {
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Button,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  type FindTransactionsParams,
  type Transaction,
  type TransactionType,
  type IncomeCategory,
  type ExpenseCategory,
  incomeCategoriesList,
  expenseCategoriesList,
} from "../types/Transaction.type";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TransactionDialog from "../components/TransactionDetailsDialog";
import TransactionFormDialog from "../components/TransactionFormDialog";
import DeleteDialog from "../../../components/DeleteDialog";
import { formatDate } from "../../../utils/convert";
const TransactionsIndex = () => {
  const { getAll, getById, create, update, remove } = useTransactions();
  const transactionStore = useTransactionsStore();

  const [pagination, setPagination] = useState({ page: 0, pageSize: 25 });
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState<FindTransactionsParams>({});
  const [dialogFormOpen, setDialogFormOpen] = useState(false);
  const [dialogDetailsOpen, setDialogDetailsOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const closeDetailsDialog = () => {
    setDialogDetailsOpen(false);
    transactionStore.setTransaction(null);
  };

  const handleAdd = () => {
    setEditingTransaction(null); // null = creating new
    setDialogFormOpen(true);
  };

  const handleEdit = async (id: number) => {
    const transaction = await getById(id);
    if (!transaction) return;
    setEditingTransaction(transaction);
    setDialogFormOpen(true);
  };

  const handleSubmit = async (data: Partial<Transaction>) => {
    console.log("Submitted data:", data);
    if (editingTransaction) {
      await update(editingTransaction.id, data);
    } else {
      await create(data);
    }
    setEditingTransaction(null); // null = creating new
  };

  const handleDelete = (id: number) => {
    setSelectedTransactionId(id);
    setDialogDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTransactionId) {
      await remove(selectedTransactionId);
      setDialogDeleteOpen(false);
    }
  };

  const showTransactionDetails = async (id: number) => {
    await getById(id);
    setDialogDetailsOpen(true);
  };

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
    transactionStore.setTransactionList(response!.data || []);
    setTotalRows(response!.meta?.total || 0);
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, pagination.page, pagination.pageSize]);

  const handleTypeChange = (event: any) => {
    const type = event.target.value as TransactionType;
    setFilters({ ...filters, type, category: undefined });
    setPagination({ ...pagination, page: 0 });
  };

  const handleCategoryChange = (event: any) => {
    const category = event.target.value as IncomeCategory | ExpenseCategory;
    setFilters({ ...filters, category });
    setPagination({ ...pagination, page: 0 });
  };

  const handleStartDateChange = (date: Date | null) => {
    setFilters({
      ...filters,
      startDate: date ? date.toISOString() : undefined,
    });
    setPagination({ ...pagination, page: 0 });
  };

  const handleEndDateChange = (date: Date | null) => {
    setFilters({ ...filters, endDate: date ? date.toISOString() : undefined });
    setPagination({ ...pagination, page: 0 });
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPagination({ page: 0, pageSize: parseInt(event.target.value, 10) });
  };

  return (
    <Paper sx={{ width: "100%", p: 2, boxShadow: "none" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: "primary.main",
          textAlign: "center",
        }}
      >
        Transactions
      </Typography>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          startIcon={<AddIcon />}
        >
          Add Transaction
        </Button>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
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
            {transactionStore.transactionList.map((row, index) => (
              <TableRow
                key={row.id}
                hover
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("button")) return;
                  showTransactionDetails(row?.id);
                }}
                sx={{
                  backgroundColor:
                    index % 2 === 0 ? "background.paper" : "action.hover",
                }}
              >
                <TableCell>{formatDate(row?.date)}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.recurring ? "Yes" : "No"}</TableCell>
                <TableCell>{row.recurring_interval}</TableCell>
                <TableCell
                  sx={{
                    color:
                      row.type === "expense" ? "error.main" : "success.main",
                    fontWeight: "bold",
                    textAlign: "right", // align right
                  }}
                >
                  {(typeof row.amount === "number"
                    ? row.amount
                    : Number(row.amount)
                  ).toFixed(2)}{" "}
                  Tk
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(row?.id)}
                    size="small"
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(row?.id)}
                    size="small"
                    color="error"
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
      <TransactionDialog
        open={dialogDetailsOpen}
        transaction={transactionStore.transaction}
        onClose={closeDetailsDialog}
      />
      <TransactionFormDialog
        open={dialogFormOpen}
        onClose={() => {
          setEditingTransaction(null);
          setDialogFormOpen(false);
        }}
        onSubmit={handleSubmit}
        transaction={editingTransaction}
      />
      <DeleteDialog
        open={dialogDeleteOpen}
        onCancel={() => setDialogDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Paper>
  );
};

export default TransactionsIndex;
