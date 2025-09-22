import {
  IsString,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

class TransactionItemDto {
  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  amount: number;
}

export class BulkTransactionDto {
  @IsDateString()
  date: string; // ISO date string

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  transactions: TransactionItemDto[];
}
