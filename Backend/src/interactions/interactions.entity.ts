import { User } from 'src/auth/user.entity';
import { People } from 'src/people/people.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type MoodType = 'happy' | 'excited' | 'neutral' | 'sad' | 'angry';
export type InteractionTag =
  | 'work'
  | 'personal'
  | 'friendship'
  | 'romance'
  | 'networking'
  | 'family'
  | 'other';

@Entity()
export class Interactions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.interactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => People, (person) => person.Interactions, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'person_id', referencedColumnName: 'id' })
  person?: People;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'text' })
  description: string; // main diary note

  // Contextual info
  @Column({ type: 'varchar', nullable: true })
  context?: string; // e.g., "Met at coffee shop"

  @Column({ type: 'varchar', nullable: true })
  medium?: string; // in-person, call, etc.

  @Column({ type: 'int', nullable: true })
  duration_minutes?: number;

  @Column({ type: 'varchar', nullable: true })
  location?: string;

  // Emotional / reflective
  @Column({
    type: 'enum',
    enum: ['happy', 'excited', 'neutral', 'sad', 'angry'],
    nullable: true,
  })
  mood?: MoodType;

  @Column({ type: 'int', nullable: true })
  energy_level?: number; // 1-10

  @Column({ type: 'varchar', nullable: true })
  person_mood?: string;

  @Column({ type: 'int', nullable: true })
  gratitude_level?: number; // 1-10

  @Column({ type: 'text', nullable: true })
  reflection?: string;

  @Column({ type: 'text', nullable: true })
  takeaways?: string;

  @Column({ type: 'text', nullable: true })
  memorable_quote?: string;

  // Engagement / tracking
  @Column({ type: 'int', nullable: true })
  fun_factor?: number; // 1-10

  @Column({ type: 'boolean', nullable: true })
  novelty_flag?: boolean;

  @Column({ type: 'boolean', default: false })
  mystery_flag?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  reminder_at?: Date;

  @Column({ type: 'varchar', nullable: true })
  highlight?: string; // short note about what made it stand out

  // Tags & attachments
  @Column({ type: 'simple-array', nullable: true })
  tags?: InteractionTag[];

  @Column({ type: 'json', nullable: true })
  attachments?: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
