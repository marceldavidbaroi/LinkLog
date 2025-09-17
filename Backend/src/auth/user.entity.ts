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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Interactions, (interaction) => interaction.user)
  interactions: Interactions[];

  @OneToOne(() => UserPreferences, (pref) => pref.user, { cascade: true })
  preferences: UserPreferences;

  @OneToMany(() => Transactions, (transaction) => transaction.user)
  transactions: Transactions[];

  @OneToMany(() => Budgets, (budget) => budget.user)
  budgets: Budgets[];
}
