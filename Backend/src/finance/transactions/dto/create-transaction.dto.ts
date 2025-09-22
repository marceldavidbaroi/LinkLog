import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import {
  TransactionType,
  IncomeCategory,
  ExpenseCategory,
  RecurringInterval,
} from '../transactions.enum';

export class CreateTransactionDto {
  @IsEnum(TransactionType, { message: 'Type must be either income or expense' })
  @IsNotEmpty()
  type: TransactionType;

  @IsEnum(
    [...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)],
    { message: 'Invalid category' },
  )
  @IsNotEmpty()
  category: IncomeCategory | ExpenseCategory;

  @IsNumber({}, { message: 'Amount must be a number' })
  @IsNotEmpty()
  amount: number;

  @IsDateString({}, { message: 'Date must be a valid ISO date string' })
  @IsNotEmpty()
  date: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Recurring must be a boolean' })
  recurring?: boolean;

  @IsOptional()
  @IsEnum(RecurringInterval, { message: 'Invalid recurring interval' })
  recurringInterval?: RecurringInterval;

  /** Optional: link this transaction to a savings goal */
  @IsOptional()
  @IsNumber({}, { message: 'savingsGoalId must be a number' })
  savingsGoalId?: number;
}
