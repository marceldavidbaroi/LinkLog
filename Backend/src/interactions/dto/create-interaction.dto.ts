import {
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsArray,
  Min,
  Max,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export type MoodType = 'happy' | 'excited' | 'neutral' | 'sad' | 'angry';
export type InteractionTag =
  | 'work'
  | 'personal'
  | 'friendship'
  | 'romance'
  | 'networking'
  | 'family'
  | 'other';

export class CreateInteractionDto {
  @IsOptional()
  @IsNumber()
  person_id?: number; // optional, may not know the person

  @IsString()
  description: string; // ⭐ required (main journal entry)

  @IsString()
  date: string; // ⭐ required, ISO date

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsString()
  medium?: string;

  @IsOptional()
  @IsInt()
  duration_minutes?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(['happy', 'excited', 'neutral', 'sad', 'angry'])
  mood?: MoodType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  energy_level?: number;

  @IsOptional()
  @IsString()
  person_mood?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  gratitude_level?: number;

  @IsOptional()
  @IsString()
  reflection?: string;

  @IsOptional()
  @IsString()
  takeaways?: string;

  @IsOptional()
  @IsString()
  memorable_quote?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: InteractionTag[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  // Engagement / tracking
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  fun_factor?: number;

  @IsOptional()
  @IsBoolean()
  novelty_flag?: boolean;

  @IsOptional()
  @IsBoolean()
  mystery_flag?: boolean;

  @IsOptional()
  @IsDateString()
  reminder_at?: string; // ISO DateTime string

  @IsOptional()
  @IsString()
  highlight?: string; // short note about what made it stand out
}
