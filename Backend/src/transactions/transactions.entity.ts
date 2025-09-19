import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../auth/user.entity';
import {
  TransactionType,
  IncomeCategory,
  ExpenseCategory,
  RecurringInterval,
} from './transactions.enum';
import { SavingsGoals } from 'src/savings-goals/savings-goals.entity';

@Entity('transactions')
@Index('idx_user_date', ['user', 'date']) // For monthly/period queries
@Index('idx_user_category_date', ['user', 'category', 'date']) // For category reports per period
@Index('idx_user_recurring', ['user', 'recurring']) // For fetching recurring txns by user
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @Index() // Explicit index on user_id (foreign key)
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
    name: 'recurring_interval',
  })
  recurringInterval?: RecurringInterval;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => SavingsGoals, (goal) => goal.transactions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Index() // Explicit index on savings_goal_id (foreign key)
  savingsGoal: SavingsGoals;
}
