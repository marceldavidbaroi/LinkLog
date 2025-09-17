import { forwardRef, Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budgets } from './budgets.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { Transactions } from 'src/transactions/transactions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budgets, Transactions]),
    forwardRef(() => TransactionsModule),
  ],
  providers: [BudgetsService],
  controllers: [BudgetsController],
})
export class BudgetsModule {}
