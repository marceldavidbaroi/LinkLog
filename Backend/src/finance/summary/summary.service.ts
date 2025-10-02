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

  /** Recalculates and upserts the Daily Summary for a specific date and user. */
  // Inside SummaryService

  private async updateDailySummary(
    dateStr: string,
    userId: number,
  ): Promise<void> {
    const totalResult = await this.transactionsRepository
      .createQueryBuilder('t')
      .select(
        'SUM(CASE WHEN t.type = :income THEN t.amount ELSE 0 END)',
        'totalIncome',
      )
      .addSelect(
        'SUM(CASE WHEN t.type = :expense THEN t.amount ELSE 0 END)',
        'totalExpense',
      )
      .where('t.user_id = :userId', { userId })
      .andWhere('t.date = :date', { date: dateStr })
      .setParameters({ income: 'income', expense: 'expense' })
      .getRawOne();

    // ⚡ FIX 1: Use repository.create() and pass relation ID in object form.
    // ⚡ FIX 2: Ensure all values match the entity's column types (string for date and decimals).
    const upsertData = this.dailySummaryRepository.create({
      // 1. Pass the User ID inside the 'user' relation object
      user: { id: userId },

      // 2. Pass the date as the YYYY-MM-DD string format (as defined in your entity)
      date: dateStr,

      // 3. Convert numbers to strings with fixed precision for DECIMAL columns
      totalIncome: (parseFloat(totalResult.totalIncome) || 0).toFixed(2),
      totalExpense: (parseFloat(totalResult.totalExpense) || 0).toFixed(2),
    });

    // Save performs the upsert based on the unique index [user, date].
    await this.dailySummaryRepository.save(upsertData);
  }
  /** Recalculates and upserts the Monthly Summary for a specific month/year and user, including Net Savings Rate. */
  // Inside SummaryService

  private async updateMonthlySummary(
    year: number,
    month: number,
    userId: number,
  ): Promise<void> {
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
        'totalIncome',
      )
      .addSelect(
        'SUM(CASE WHEN t.type = :expense THEN t.amount ELSE 0 END)',
        'totalExpense',
      )
      .where('t.user_id = :userId', { userId })
      .andWhere('t.date >= :monthStart', { monthStart })
      .andWhere('t.date < :monthEnd', { monthEnd })
      .setParameters({ income: 'income', expense: 'expense' })
      .getRawOne();

    const totalIncome = parseFloat(totalResult.totalIncome) || 0;
    const totalExpense = parseFloat(totalResult.totalExpense) || 0;

    let netSavingsRate = 0;
    const netIncome = totalIncome - totalExpense;
    if (totalIncome > 0) {
      netSavingsRate = netIncome / totalIncome;
    }

    // ⚡ FIX 1: Use repository.create() for proper entity mapping.
    // ⚡ FIX 2: Convert totals to strings with fixed precision (for DECIMAL columns).
    const upsertData = this.monthlySummaryRepository.create({
      // 1. Pass the User ID inside the 'user' relation object
      user: { id: userId },

      year,
      month,

      // 2. Convert amounts to strings with two decimals
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),

      // 3. NOTE: This must be uncommented once you add the column to the entity!
      // netSavingsRate: netSavingsRate.toFixed(4),
    });

    // Save performs the upsert based on the unique index [user, year, month].
    await this.monthlySummaryRepository.save(upsertData);
  }

  /** Recalculates and upserts the Category Monthly Summary for a specific key set. */
  private async updateCategoryMonthlySummary(
    year: number,
    month: number,
    categoryId: number,
    type: 'income' | 'expense',
    userId: number,
  ): Promise<void> {
    const monthStart = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const monthEnd = new Date(nextYear, nextMonth - 1, 1)
      .toISOString()
      .split('T')[0];

    const totalResult = await this.transactionsRepository
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'totalAmount')
      .where('t.user_id = :userId', { userId })
      .andWhere('t.category_id = :categoryId', { categoryId })
      .andWhere('t.type = :type', { type })
      .andWhere('t.date >= :monthStart', { monthStart })
      .andWhere('t.date < :monthEnd', { monthEnd })
      .getRawOne();

    // Prepare the entity for upsert.
    const upsertData = this.monthlyCategorySummaryRepository.create({
      user: { id: userId },
      year,
      month,
      category: { id: categoryId },
      type,
      totalAmount: (parseFloat(totalResult.totalAmount) || 0).toFixed(2),
    });

    // Performs an upsert based on the composite index.
    await this.monthlyCategorySummaryRepository.save(upsertData);
  }
}
