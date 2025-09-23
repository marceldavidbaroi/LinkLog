import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserPreferences } from './userPreferences.entity';
import { Transactions } from 'src/finance/transactions/transactions.entity';
import { Budgets } from 'src/finance/budgets/budgets.entity';
import { SavingsGoals } from 'src/finance/savings-goals/savings-goals.entity';
import { Reports } from 'src/finance/reports/reports.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => UserPreferences, (pref) => pref.user, { cascade: true })
  preferences: UserPreferences;

  @OneToMany(() => Transactions, (transaction) => transaction.user)
  transactions: Transactions[];

  @OneToMany(() => Budgets, (budget) => budget.user)
  budgets: Budgets[];

  @OneToMany(() => SavingsGoals, (savingsGoal) => savingsGoal.user)
  savingsGoals: SavingsGoals[];

  @OneToMany(() => Reports, (report) => report.user)
  reports: Reports[];
}
