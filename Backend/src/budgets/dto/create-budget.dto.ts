import { IsEnum, IsNumber, IsInt, IsPositive, Min, Max } from 'class-validator';
import { ExpenseCategory } from 'src/transactions/transactions.enum';

export class CreateBudgetDto {
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  @Min(1900) // adjust as needed
  year: number;
}
