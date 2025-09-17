import React, { useState } from "react";
import { Box, Typography, IconButton, Card, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";

export interface Budget {
  id: number;
  category: string;
  amount: string;
  month: number;
  year: number;
}

export interface BudgetAlert {
  budget: Budget;
  spent: number;
  limitReached: boolean;
  percentageUsed: number;
}

interface BudgetAlertsProps {
  alerts: BudgetAlert[];
}

const BudgetAlerts: React.FC<BudgetAlertsProps> = ({ alerts }) => {
  const [visibleAlerts, setVisibleAlerts] = useState<BudgetAlert[]>(alerts);

  const handleClose = (id: number) => {
    setVisibleAlerts((prev) => prev.filter((alert) => alert.budget.id !== id));
  };

  const handleClearAll = () => {
    setVisibleAlerts([]);
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        zIndex: 9999,
        maxWidth: 320,
      }}
    >
      {/* Clear All Button */}
      <Button
        variant="outlined"
        size="small"
        startIcon={<ClearAllIcon />}
        onClick={handleClearAll}
        sx={{
          alignSelf: "flex-end",
          color: "white",
          borderColor: "white",
          bgcolor: "rgba(0,0,0,0.5)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
      >
        Clear All
      </Button>

      {visibleAlerts.map((alert) => (
        <Card
          key={alert.budget.id}
          sx={{
            p: 2,
            bgcolor: alert.limitReached ? "error.main" : "warning.main",
            color: "white",
            borderRadius: 3,
            boxShadow: 6,
            minWidth: 260,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {alert.budget.category.replace(/_/g, " ")}
              </Typography>
              <Typography variant="body2">
                {alert.spent} / {alert.budget.amount} used (
                {(alert.percentageUsed * 100).toFixed(0)}%)
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => handleClose(alert.budget.id)}
              sx={{ color: "white" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default BudgetAlerts;
