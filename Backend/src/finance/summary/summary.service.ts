import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from 'src/finance/transactions/transactions.entity';
// ⚡ Imported actual entity classes
import { MonthlyCategorySummary } from './category_monthly_summary.entity';
import { DailySummary } from './daily_summary.entity';
import { MonthlySummary } from './monthly_summary.entity';

// ⚡ Renamed local interfaces to avoid conflict with the imported entity names
interface IDailySummary {
  id: number;
  userId: number;
  date: Date;
  totalIncome: number;
  totalExpense: number;
}
interface IMonthlySummary {
  id: number;
  userId: number;
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  netSavingsRate: number;
}

@Injectable()
export class SummaryService {
  private readonly logger = new Logger(SummaryService.name);

  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    // ⚡ Injecting the actual imported entity class (DailySummary)
    @InjectRepository(DailySummary)
    private dailySummaryRepository: Repository<DailySummary>,
    // ⚡ Injecting the actual imported entity class (MonthlySummary)
    @InjectRepository(MonthlySummary)
    private monthlySummaryRepository: Repository<MonthlySummary>,
    @InjectRepository(MonthlyCategorySummary)
    private monthlyCategorySummaryRepository: Repository<MonthlyCategorySummary>,
  ) {}

  /**
   * Main handler for transaction changes (create, update, delete).
   * Triggers the necessary recalculations for all affected periods and categories.
   */
  async handleTransactionChange(
    oldTxn?: Transactions,
    newTxn?: Transactions,
  ): Promise<void> {
    try {
      const targetTxn = newTxn || oldTxn;
      // Access user ID via the relation object's ID
      const userId = targetTxn?.user?.id;

      if (!userId) {
        this.logger.warn(
          'handleTransactionChange called without valid user context.',
        );
        return;
      }

      const affectedKeys: {
        date: string;
        year: number;
        month: number;
        categoryId: number;
        type: 'income' | 'expense';
      }[] = [];

      const extractKeys = (txn: Transactions) => {
        // ⚡ Acknowledge that txn.date is a string as defined in the entity
        const dateString = txn.date;

        // Use a Date object to safely extract year and month from the date string
        const dateObject = new Date(dateString);

        return {
          date: dateString,
          year: dateObject.getFullYear(),
          month: dateObject.getMonth() + 1, // 1-12
          categoryId: txn.category?.id,
          type: txn.type,
        };
      };

      // Keys from the old state (for update/delete)
      if (oldTxn) {
        affectedKeys.push(extractKeys(oldTxn));
      }

      // Keys from the new state (for create/update)
      if (newTxn) {
        const newKeys = extractKeys(newTxn);
        const oldKeys = oldTxn ? extractKeys(oldTxn) : null;

        // Check for duplicates based on old state keys
        const isDuplicate =
          oldTxn &&
          newKeys.date === oldKeys?.date &&
          newKeys.categoryId === oldKeys?.categoryId;

        if (!isDuplicate) {
          affectedKeys.push(newKeys);
        }
      }

      // Filter for unique keys
      const uniqueKeys = Array.from(
        new Set(affectedKeys.map((k) => JSON.stringify(k))),
      ).map((s) => JSON.parse(s));

      // 2. Process all unique affected keys
      for (const key of uniqueKeys) {
        if (!key.categoryId) {
          this.logger.error(
            `Skipping summary update: Transaction missing categoryId for key: ${JSON.stringify(key)}`,
          );
          continue;
        }

        // Daily and Monthly summary
        await this.updateDailySummary(key.date, userId);
        await this.updateMonthlySummary(key.year, key.month, userId);

        // Category Monthly Summary
        await this.updateCategoryMonthlySummary(
          key.year,
          key.month,
          key.categoryId,
          key.type,
          userId,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing transaction change: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update financial summaries. Consistency lost.',
      );
    }
  }

  private async updateDailySummary(dateStr: string, userId: number) {
    const totalResult = await this.transactionsRepository
      .createQueryBuilder('t')
      .select(
        'SUM(CASE WHEN t.type = :income THEN t.amount ELSE 0 END)',
        'total_income',
      )
      .addSelect(
        'SUM(CASE WHEN t.type = :expense THEN t.amount ELSE 0 END)',
        'total_expense',
      )
      .where('t.user_id = :userId', { userId })
      .andWhere('t.date = :date', { date: dateStr })
      .setParameters({ income: 'income', expense: 'expense' })
      .getRawOne();

    await this.dailySummaryRepository
      .createQueryBuilder()
      .insert()
      .into(DailySummary)
      .values({
        user: { id: userId },
        date: dateStr,
        totalIncome: (parseFloat(totalResult.total_income) || 0).toFixed(2),
        totalExpense: (parseFloat(totalResult.total_expense) || 0).toFixed(2),
      })
      .onConflict(
        `("user_id", "date") DO UPDATE SET 
      "total_income" = EXCLUDED."total_income",
      "total_expense" = EXCLUDED."total_expense"`,
      )
      .execute();
  }

  private async updateMonthlySummary(
    year: number,
    month: number,
    userId: number,
  ) {
    const monthStart = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const monthEnd = new Date(nextYear, nextMonth - 1, 1)
      .toISOString()
      .split('T')[0];

    const totalResult = await this.transactionsRepository
      .createQueryBuilder('t')
      .select(
        'SUM(CASE WHEN t.type = :income THEN t.amount ELSE 0 END)',
        'total_income',
      )
      .addSelect(
        'SUM(CASE WHEN t.type = :expense THEN t.amount ELSE 0 END)',
        'total_expense',
      )
      .where('t.user_id = :userId', { userId })
      .andWhere('t.date >= :monthStart', { monthStart })
      .andWhere('t.date < :monthEnd', { monthEnd })
      .setParameters({ income: 'income', expense: 'expense' })
      .getRawOne();

    const totalIncome = parseFloat(totalResult.total_income) || 0;
    const totalExpense = parseFloat(totalResult.total_expense) || 0;

    await this.monthlySummaryRepository
      .createQueryBuilder()
      .insert()
      .into(MonthlySummary)
      .values({
        user: { id: userId },
        year,
        month,
        totalIncome: totalIncome.toFixed(2),
        totalExpense: totalExpense.toFixed(2),
      })
      .onConflict(
        `("user_id", "year", "month") DO UPDATE SET 
      "total_income" = EXCLUDED."total_income",
      "total_expense" = EXCLUDED."total_expense"`,
      )
      .execute();
  }

  private async updateCategoryMonthlySummary(
    year: number,
    month: number,
    categoryId: number,
    type: 'income' | 'expense',
    userId: number,
  ) {
    const monthStart = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const monthEnd = new Date(nextYear, nextMonth - 1, 1)
      .toISOString()
      .split('T')[0];

    const totalResult = await this.transactionsRepository
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'total_amount')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.category_id = :categoryId', { categoryId })
      .andWhere('t.type = :type', { type })
      .andWhere('t.date >= :monthStart', { monthStart })
      .andWhere('t.date < :monthEnd', { monthEnd })
      .getRawOne();

    await this.monthlyCategorySummaryRepository
      .createQueryBuilder()
      .insert()
      .into(MonthlyCategorySummary)
      .values({
        user: { id: userId },
        year,
        month,
        category: { id: categoryId },
        type,
        totalAmount: (parseFloat(totalResult.total_amount) || 0).toFixed(2),
      })
      .onConflict(
        `("user_id", "year", "month", "category_id", "type") DO UPDATE SET 
      "total_amount" = EXCLUDED."total_amount"`,
      )
      .execute();
  }
}
