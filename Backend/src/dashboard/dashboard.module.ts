import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from '../transactions/transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
