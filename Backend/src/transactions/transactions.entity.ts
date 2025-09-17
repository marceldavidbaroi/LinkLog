import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../auth/user.entity';
import {
  TransactionType,
  IncomeCategory,
  ExpenseCategory,
  RecurringInterval,
} from './transactions.enum';

@Entity('transactions')
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: [...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)],
  })
  category: IncomeCategory | ExpenseCategory;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  recurring: boolean;

  @Column({
    type: 'enum',
    enum: RecurringInterval,
    nullable: true,
  })
  recurring_interval?: RecurringInterval;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
