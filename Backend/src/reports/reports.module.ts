import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reports } from './reports.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { BudgetsModule } from 'src/budgets/budgets.module';
import { SavingsGoalsModule } from 'src/savings-goals/savings-goals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reports]),
    TransactionsModule,
    BudgetsModule,
    SavingsGoalsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
