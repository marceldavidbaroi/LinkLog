import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Transactions } from 'src/transactions/transactions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FinanceDashboardService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
  ) {}

  async getOverview(
    user: User,
    startDate?: string,
    endDate?: string,
  ): Promise<{
    income: { category: string; total: number }[];
    expense: { category: string; total: number }[];
    total: { income: number; expense: number };
  }> {
    const query = this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('transaction.type', 'type')
      .addSelect('SUM(transaction.amount)', 'total')
      .where('transaction.userId = :userId', { userId: user.id })
      .groupBy('transaction.category')
      .addGroupBy('transaction.type');

    if (startDate) {
      query.andWhere('transaction.date >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      query.andWhere('transaction.date <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    const raw = await query.getRawMany<{
      category: string;
      type: 'income' | 'expense';
      total: string; // returned as string by SQL SUM
    }>();

    const income: { category: string; total: number }[] = [];
    const expense: { category: string; total: number }[] = [];
    let totalIncome = 0;
    let totalExpense = 0;

    raw.forEach((row) => {
      const total = parseFloat(row.total);
      if (row.type === 'income') {
        income.push({ category: row.category, total });
        totalIncome += total;
      } else {
        expense.push({ category: row.category, total });
        totalExpense += total;
      }
    });

    return {
      income,
      expense,
      total: {
        income: totalIncome,
        expense: totalExpense,
      },
    };
  }
}
