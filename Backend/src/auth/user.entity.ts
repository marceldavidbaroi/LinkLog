import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Interactions } from 'src/interactions/interactions.entity';
import { UserPreferences } from './userPreferences.entity';
import { Transactions } from 'src/transactions/transactions.entity';
import { Budgets } from 'src/budgets/budgets.entity';
import { SavingsGoals } from 'src/savings-goals/savings-goals.entity';
import { Reports } from 'src/reports/reports.entity';

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

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => Interactions, (interaction) => interaction.user)
  interactions: Interactions[];

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
