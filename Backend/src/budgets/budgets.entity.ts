import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { ExpenseCategory } from 'src/transactions/transactions.enum';

@Entity('budgets')
export class Budgets {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.budgets, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'enum',
    enum: [...Object.values(ExpenseCategory)],
  })
  category: ExpenseCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // budgeted amount

  @Column({ type: 'int' })
  month: number; // 1–12

  @Column({ type: 'int' })
  year: number; // e.g., 2025

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
