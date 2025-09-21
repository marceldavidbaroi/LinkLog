## Relationships

- **Users → Transactions** = 1:N
- **Users → Budgets** = 1:N
- **Users → Savings Goals** = 1:N
- **Savings Goals → Transactions** = 1:N
- **Users → Reports** = 1:N

## Transactions Table

Tracks income and expenses.

| Column Name        | Type              | Description                                    |
| ------------------ | ----------------- | ---------------------------------------------- |
| id                 | int               | Primary key                                    |
| user_id            | int               | Foreign key → Users                            |
| type               | enum              | `'income'` or `'expense'`                      |
| category           | enum or varchar   | Income or Expense category                     |
| amount             | decimal           | Transaction amount                             |
| date               | date or timestamp | Transaction date                               |
| description        | text              | Optional notes                                 |
| recurring          | boolean           | True if recurring                              |
| recurring_interval | enum              | `'daily'`, `'weekly'`, `'monthly'`, `'yearly'` |
| created_at         | timestamp         | Record creation                                |
| updated_at         | timestamp         | Record update                                  |

### 📝 Enum Notes

- **type**

  - `income`
  - `expense`

- **category**

  - **Income categories:**  
    `salary`, `freelance`, `business`, `investment`, `rental_income`, `gift`, `refund`, `other_income`
  - **Expense categories:**  
    `food_groceries`, `food_dining`, `housing_rent`, `housing_mortgage`, `utilities`, `transportation`, `health_medical`, `education`, `entertainment`, `shopping`, `travel`, `personal_care`, `insurance`, `debt_repayment`, `savings_investments`, `charity_donation`, `other_expense`

- **recurring_interval**  
  `daily`, `weekly`, `monthly`, `yearly`

---

## Budgets Table

Tracks monthly budgets per category.

| Column Name | Type            | Description         |
| ----------- | --------------- | ------------------- |
| id          | int             | Primary key         |
| user_id     | int             | Foreign key → Users |
| category    | enum or varchar | Budget category     |
| amount      | decimal         | Budgeted amount     |
| month       | int             | 1–12                |
| year        | int             | e.g., 2025          |
| created_at  | timestamp       | Record creation     |
| updated_at  | timestamp       | Record update       |

---

## Savings Goals Table

Tracks goals and progress.

| Column Name   | Type      | Description                                |
| ------------- | --------- | ------------------------------------------ |
| id            | int       | Primary key                                |
| user_id       | int       | Foreign key → Users                        |
| name          | varchar   | Goal name (e.g., Vacation)                 |
| target_amount | decimal   | Amount to save                             |
| saved_amount  | decimal   | Current saved amount                       |
| priority      | varchar   | Optional priority: `HIGH`, `MEDIUM`, `LOW` |
| due_date      | date      | Optional target date                       |
| created_at    | timestamp | Record creation                            |
| updated_at    | timestamp | Record update                              |

---

## Reports Table (Optional)

Stores cached reports for faster PDF export or analytics.

| Column Name  | Type         | Description                              |
| ------------ | ------------ | ---------------------------------------- |
| id           | int          | Primary key                              |
| user_id      | int          | Foreign key → Users                      |
| report_type  | enum         | `'monthly'`, `'half_yearly'`, `'yearly'` |
| period_start | date         | Start of report period                   |
| period_end   | date         | End of report period                     |
| data         | JSON or text | Precomputed report data                  |
| created_at   | timestamp    | Record creation                          |
