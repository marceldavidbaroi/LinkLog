import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { PeopleModule } from './people/people.module';
import { InteractionsModule } from './interactions/interactions.module';
import { TransactionsModule } from './transactions/transactions.module';
import { FinanceDashboardModule } from './finance-dashboard/finance-dashboard.module';
import { BudgetsModule } from './budgets/budgets.module';
import { SavingsGoalsModule } from './savings-goals/savings-goals.module';
import { ReportsModule } from './reports/reports.module';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    PeopleModule,
    InteractionsModule,
    TransactionsModule,
    FinanceDashboardModule,
    BudgetsModule,
    SavingsGoalsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
