export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum IncomeCategory {
  SALARY = 'salary',
  FREELANCE = 'freelance',
  BUSINESS = 'business',
  INVESTMENT = 'investment',
  RENTAL_INCOME = 'rental_income',
  GIFT = 'gift',
  REFUND = 'refund',
  OTHER_INCOME = 'other_income',
}

export enum ExpenseCategory {
  FOOD_GROCERIES = 'food_groceries',
  FOOD_DINING = 'food_dining',
  HOUSING_RENT = 'housing_rent',
  HOUSING_MORTGAGE = 'housing_mortgage',
  UTILITIES = 'utilities',
  TRANSPORTATION = 'transportation',
  HEALTH_MEDICAL = 'health_medical',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  TRAVEL = 'travel',
  PERSONAL_CARE = 'personal_care',
  INSURANCE = 'insurance',
  DEBT_REPAYMENT = 'debt_repayment',
  SAVINGS_INVESTMENTS = 'savings_investments',
  CHARITY_DONATION = 'charity_donation',
  OTHER_EXPENSE = 'other_expense',
}

export enum RecurringInterval {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}
