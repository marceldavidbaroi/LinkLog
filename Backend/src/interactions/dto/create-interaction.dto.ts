import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateInteractionDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  person_id: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsString()
  raw_note: string;
}
