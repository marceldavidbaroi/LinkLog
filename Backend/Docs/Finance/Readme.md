# Personal Finance App

This app helps users track their finances, set budgets, and achieve financial goals. The development is planned in three phases, starting with essential features and gradually adding more advanced insights.

---

## Phase 1: Core Features (MVP – Must-Have)

These are essential for users to start tracking their finances.

### 1. Income & Expense Tracking

- Add, edit, delete transactions
- Categorize transactions (Food, Rent, Entertainment, etc.)
- Mark transactions as recurring

**Suggestions:**

- Include a “quick add transaction” button for better UX
- Show visual indicators (bars/pie charts) for category spending

### 2. Dashboard / Overview

- Total income vs expenses
- Monthly spending overview
- Quick insights (e.g., “You spent 30% more on food”)

### 3. Budgeting

- Set monthly budgets per category
- Alerts when nearing budget limits

**Suggestions:**

- Show visual indicators for remaining budget per category

---

## Phase 2: Savings & Goals

These features add meaningful value beyond simple tracking.

### 4. Savings Goals

- Create financial goals (e.g., vacation, emergency fund)
- Track progress toward goals
- Emergency fund tracker

**Suggestions:**

- Allow setting automatic contributions to savings goals
- Include a priority level for each goal (optional)

---

## Phase 3: Reports & Insights

Generate insights that help users plan better.

### 5. Financial Insights & Reports

- Monthly spending report
- Monthly budget vs actual
- Half-yearly and yearly summary
- Export data as PDF / CSV

**Suggestions:**

- Include category-based visual reports (pie chart per category, bar chart per month)
- Highlight top 3 spending categories for user awareness

---

---

# 📊 Personal Finance App - Database Schema

This document describes the core database tables for the Personal Finance App, including their columns, types, and relationships.

---

## 1. Users Table

Tracks app users.  
_(Basic structure assumed, details not included in this document)_

---

## 2. Transactions Table

Tracks income and expenses.

| Column Name        | Type             | Description                            |
| ------------------ | ---------------- | -------------------------------------- |
| id                 | UUID / int       | Primary key                            |
| user_id            | UUID / int       | Foreign key → Users                    |
| type               | enum             | 'income' or 'expense'                  |
| category           | enum / varchar   | Food, Rent, Entertainment, etc.        |
| amount             | decimal          | Transaction amount                     |
| date               | date / timestamp | Transaction date                       |
| description        | text             | Optional notes                         |
| recurring          | boolean          | True if recurring                      |
| recurring_interval | enum             | 'daily', 'weekly', 'monthly', 'yearly' |
| created_at         | timestamp        | Record creation                        |
| updated_at         | timestamp        | Record update                          |

---

## 3. Budgets Table

Tracks monthly budgets per category.

| Column Name | Type           | Description                     |
| ----------- | -------------- | ------------------------------- |
| id          | UUID / int     | Primary key                     |
| user_id     | UUID / int     | Foreign key → Users             |
| category    | enum / varchar | Food, Rent, Entertainment, etc. |
| amount      | decimal        | Budgeted amount                 |
| month       | int            | 1-12                            |
| year        | int            | e.g., 2025                      |
| created_at  | timestamp      | Record creation                 |
| updated_at  | timestamp      | Record update                   |

---

## 4. Savings Goals Table

Tracks goals and progress.

| Column Name   | Type       | Description                |
| ------------- | ---------- | -------------------------- |
| id            | UUID / int | Primary key                |
| user_id       | UUID / int | Foreign key → Users        |
| name          | varchar    | Goal name (e.g., Vacation) |
| target_amount | decimal    | Amount to save             |
| saved_amount  | decimal    | Current saved amount       |
| priority      | int        | Optional priority level    |
| due_date      | date       | Optional target date       |
| created_at    | timestamp  | Record creation            |
| updated_at    | timestamp  | Record update              |

---

## 5. Reports Table (Optional)

Stores cached reports for faster PDF export or analytics.

| Column Name  | Type        | Description                        |
| ------------ | ----------- | ---------------------------------- |
| id           | UUID / int  | Primary key                        |
| user_id      | UUID / int  | Foreign key → Users                |
| report_type  | enum        | 'monthly', 'half_yearly', 'yearly' |
| period_start | date        | Start of report period             |
| period_end   | date        | End of report period               |
| data         | JSON / text | Precomputed report data            |
| created_at   | timestamp   | Record creation                    |

---

## Relationships

- **Users → Transactions** = 1:N
- **Users → Budgets** = 1:N
- **Users → Savings Goals** = 1:N
- **Users → Reports** = 1:N

---

# 🛠️ Personal Finance App - API Endpoints

This document lists all REST API endpoints for the Personal Finance App, organized by feature and phase.

---

## Phase 1: Core Features (MVP)

### 1️⃣ Income & Expense Tracking (Transactions)

**Base URL:** `/transactions`

| Method | Endpoint                  | Description                                                                                        |
| ------ | ------------------------- | -------------------------------------------------------------------------------------------------- |
| GET    | `/transactions`           | Get all transactions for the authenticated user (supports filters like date range, type, category) |
| GET    | `/transactions/:id`       | Get details of a single transaction                                                                |
| POST   | `/transactions`           | Create a new transaction                                                                           |
| PUT    | `/transactions/:id`       | Update an existing transaction                                                                     |
| DELETE | `/transactions/:id`       | Delete a transaction                                                                               |
| POST   | `/transactions/quick-add` | Quick add transaction (minimal fields: type, amount, category)                                     |
| GET    | `/transactions/summary`   | Get total income vs expenses or category-based totals for dashboard                                |

---

### 2️⃣ Dashboard / Overview

**Base URL:** `/dashboard`

| Method | Endpoint                        | Description                                                                     |
| ------ | ------------------------------- | ------------------------------------------------------------------------------- |
| GET    | `/dashboard/overview`           | Returns summary: total income, total expenses, net savings, recent transactions |
| GET    | `/dashboard/category-spending`  | Returns spending per category (for charts)                                      |
| GET    | `/dashboard/monthly-comparison` | Compares current vs previous months                                             |
| GET    | `/dashboard/alerts`             | Alerts for overspending or approaching budget limits                            |

---

### 3️⃣ Budgeting

**Base URL:** `/budgets`

| Method | Endpoint          | Description                                 |
| ------ | ----------------- | ------------------------------------------- |
| GET    | `/budgets`        | Get all budgets for the user                |
| GET    | `/budgets/:id`    | Get a single budget record                  |
| POST   | `/budgets`        | Create a new budget                         |
| PUT    | `/budgets/:id`    | Update a budget                             |
| DELETE | `/budgets/:id`    | Delete a budget                             |
| GET    | `/budgets/alerts` | Check which budgets are nearing their limit |

---

## Phase 2: Savings & Goals

### 4️⃣ Savings Goals

**Base URL:** `/savings-goals`

| Method | Endpoint                         | Description                                                         |
| ------ | -------------------------------- | ------------------------------------------------------------------- |
| GET    | `/savings-goals`                 | List all savings goals                                              |
| GET    | `/savings-goals/:id`             | Get details of a savings goal                                       |
| POST   | `/savings-goals`                 | Create a new savings goal                                           |
| PUT    | `/savings-goals/:id`             | Update a savings goal (progress, target amount, priority, due date) |
| DELETE | `/savings-goals/:id`             | Delete a savings goal                                               |
| POST   | `/savings-goals/auto-contribute` | Optional: set up automatic contributions                            |

---

## Phase 3: Reports & Insights

### 5️⃣ Financial Insights & Reports

**Base URL:** `/reports`

| Method | Endpoint                   | Description                                          |
| ------ | -------------------------- | ---------------------------------------------------- |
| GET    | `/reports`                 | List all reports for the user                        |
| GET    | `/reports/:id`             | Get a single report                                  |
| POST   | `/reports`                 | Generate a new report (monthly, half-yearly, yearly) |
| DELETE | `/reports/:id`             | Delete a cached report                               |
| GET    | `/reports/export/:id`      | Export report as PDF/CSV                             |
| GET    | `/reports/top-categories`  | Return top 3 spending categories for awareness       |
| GET    | `/reports/category-charts` | Return category-based charts data (pie, bar)         |
