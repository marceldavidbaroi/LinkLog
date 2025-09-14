import {
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsString,
  Matches,
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

export class SummaryQueryDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in the format YYYY-MM-DD',
  })
  startDate?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be in the format YYYY-MM-DD',
  })
  endDate?: string;
}
