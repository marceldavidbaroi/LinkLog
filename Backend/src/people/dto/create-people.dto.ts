// src/people/dto/create-people.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreatePeopleDto {
  @IsString()
  @MaxLength(50)
  first_name: string;

  @IsString()
  @MaxLength(50)
  last_name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  emergency_contact?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
