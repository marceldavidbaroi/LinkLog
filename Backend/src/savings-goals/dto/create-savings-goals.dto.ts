import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
  IsEnum,
} from 'class-validator';
import { Priority } from '../savings-goals.entity';

export class CreateSavingsGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  target_amount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  saved_amount?: number;

  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be HIGH, MEDIUM, or LOW' })
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  due_date?: string;
}
