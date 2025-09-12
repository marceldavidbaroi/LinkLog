import {
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TransactionType,
  IncomeCategory,
  ExpenseCategory,
} from '../transactions.enum';

export class FindTransactionsDto {
  @IsOptional()
  @IsEnum(TransactionType, { message: 'Type must be either income or expense' })
  type?: TransactionType;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category?: IncomeCategory | ExpenseCategory;

  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid ISO date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO date string' })
  endDate?: string;

  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25;
}
