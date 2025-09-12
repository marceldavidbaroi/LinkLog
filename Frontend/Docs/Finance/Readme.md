# 🎨 Personal Finance App – Frontend Routing Guide

The app uses **React Router** (or Vue Router in Quasar).  
Authentication is handled via JWT. All finance features live under `/finance/...`.

---

## 🌱 Phase 1: Core Features (MVP – Must-Have)

---

### 💸 Transactions Routes

- **`/finance/transactions` → `TransactionsPage`**

  - Task: Fetch & display all transactions (paginated).
  - Features:
    - Filters: date range, type (income/expense), category
    - Table or card layout
    - Buttons: **Add**, **Edit**, **Delete**

- **`/finance/transactions/new` → `TransactionFormModal`**

  - Task: Create transaction (form fields: type, category, amount, date, description, recurring).
  - Feature: “Quick Add” button with minimal fields (type, amount, category).

- **`/finance/transactions/:id/edit` → `TransactionFormModal`**

  - Task: Edit an existing transaction.
  - Pre-fill form with transaction data.

- **`/finance/transactions/:id` → `TransactionDetailsPage`** _(optional)_
  - Task: View a single transaction with full details.

---

### 📊 Dashboard Routes

- **`/finance/dashboard` → `DashboardPage`**
  - Task: Display high-level financial overview.
  - Features:
    - KPIs: total income, total expenses, net savings
    - Bar chart: monthly spending overview
    - Pie chart: category spending distribution
    - Quick insights card: “You spent 30% more on food this month”

---

### 💡 Budgeting Routes

- **`/finance/budgets` → `BudgetsPage`**

  - Task: List all budgets by category.
  - Features:
    - Progress bar: spent vs. budget
    - Alerts when nearing/exceeding budget

- **`/finance/budgets/new` → `BudgetFormModal`**

  - Task: Create a new budget (category, amount, timeframe).

- **`/finance/budgets/:id/edit` → `BudgetFormModal`**
  - Task: Edit existing budget.

---

## 💰 Phase 2: Savings & Goals

### 🏦 Savings Goals Routes

- **`/finance/savings-goals` → `SavingsGoalsPage`**

  - Task: Show all savings goals with progress indicators.
  - Features:
    - Priority badges (e.g., High, Medium, Low)
    - Progress bar (saved vs target)

- **`/finance/savings-goals/new` → `GoalFormModal`**

  - Task: Create new goal (fields: name, target amount, due date, priority).

- **`/finance/savings-goals/:id/edit` → `GoalFormModal`**

  - Task: Edit goal details.

- **`/finance/savings-goals/:id` → `GoalDetailsPage`**
  - Task: Show single goal detail.
  - Feature: Contribution history & goal completion timeline.

---

## 📊 Phase 3: Reports & Insights

### 📑 Reports Routes

- **`/finance/reports` → `ReportsPage`**

  - Task: Show generated reports list.
  - Feature: Export to PDF/CSV.

- **`/finance/reports/:id` → `ReportDetailsPage`**
  - Task: Show report details.
  - Features:
    - Charts: monthly comparison, category distribution
    - Highlight top 3 spending categories

---

### 🔍 Insights (Dashboard Widget)

- **`/finance/dashboard` → `InsightsWidget` (component, not separate page)**
  - Task: Provide smart insights.
  - Features:
    - Overspending alerts
    - Top categories for the month
    - Trend analysis

---
