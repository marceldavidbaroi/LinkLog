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

  /**
   * Compare current month (based on start date) with previous month
   * @param user - authenticated user
   * @param currentMonthStart - first date of current month as 'yyyy-mm-dd'
   */
  async compareWithPreviousMonth(
    user: User,
    currentMonthStart: string,
  ): Promise<{
    overview: {
      income: { prev: number; current: number; percentage: number };
      expense: { prev: number; current: number; percentage: number };
      savings: { prev: number; current: number; percentage: number };
    };
    details: {
      category: string;
      type: 'income' | 'expense';
      prev: number;
      current: number;
      percentage: number;
    }[];
  }> {
    const startDate = new Date(currentMonthStart);
    const currentMonth = startDate.getMonth() + 1; // 1-12
    const currentYear = startDate.getFullYear();

    // previous month calculation
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousMonthYear =
      currentMonth === 1 ? currentYear - 1 : currentYear;

    const getMonthRange = (year: number, month: number) => ({
      start: new Date(year, month - 1, 1),
      end: new Date(year, month, 0, 23, 59, 59, 999), // last day of month
    });

    const currentRange = getMonthRange(currentYear, currentMonth);
    const prevRange = getMonthRange(previousMonthYear, previousMonth);

    // Fetch transactions for both months
    const raw = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('transaction.type', 'type')
      .addSelect('SUM(transaction.amount)', 'total')
      .addSelect('MONTH(transaction.date)', 'month')
      .where('transaction.userId = :userId', { userId: user.id })
      .andWhere('(transaction.date BETWEEN :prevStart AND :currentEnd)', {
        prevStart: prevRange.start,
        currentEnd: currentRange.end,
      })
      .groupBy('transaction.category')
      .addGroupBy('transaction.type')
      .addGroupBy('MONTH(transaction.date)')
      .getRawMany<{
        category: string;
        type: 'income' | 'expense';
        total: string;
        month: number;
      }>();

    let prevIncome = 0,
      currentIncome = 0,
      prevExpense = 0,
      currentExpense = 0;

    const detailsMap: Record<
      string,
      {
        category: string;
        type: 'income' | 'expense';
        prev: number;
        current: number;
        percentage: number;
      }
    > = {};

    raw.forEach((row) => {
      const total = parseFloat(row.total);
      const isCurrentMonth = row.month === currentMonth;

      // Aggregate overview totals
      if (row.type === 'income') {
        if (isCurrentMonth) currentIncome += total;
        else prevIncome += total;
      } else {
        if (isCurrentMonth) currentExpense += total;
        else prevExpense += total;
      }

      // Aggregate per category
      const key = `${row.category}-${row.type}`;
      if (!detailsMap[key]) {
        detailsMap[key] = {
          category: row.category,
          type: row.type,
          prev: 0,
          current: 0,
          percentage: 0,
        };
      }
      if (isCurrentMonth) detailsMap[key].current += total;
      else detailsMap[key].prev += total;
    });

    const calcPercentage = (prev: number, current: number) =>
      prev === 0 ? (current === 0 ? 0 : 100) : ((current - prev) / prev) * 100;

    const overview = {
      income: {
        prev: prevIncome,
        current: currentIncome,
        percentage: calcPercentage(prevIncome, currentIncome),
      },
      expense: {
        prev: prevExpense,
        current: currentExpense,
        percentage: calcPercentage(prevExpense, currentExpense),
      },
      savings: {
        prev: prevIncome - prevExpense,
        current: currentIncome - currentExpense,
        percentage: calcPercentage(
          prevIncome - prevExpense,
          currentIncome - currentExpense,
        ),
      },
    };

    const details = Object.values(detailsMap).map((d) => ({
      ...d,
      percentage: calcPercentage(d.prev, d.current),
    }));

    return { overview, details };
  }
}
