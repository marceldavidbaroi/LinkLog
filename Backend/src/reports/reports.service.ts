import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Reports, ReportType } from './reports.entity';
import { User } from 'src/auth/user.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { ExportFormat } from './reports.enum';
import { ReportExport } from 'src/utils/report-export';
import {
  ExpenseCategory,
  TransactionType,
} from 'src/transactions/transactions.enum';
import { BudgetsService } from 'src/budgets/budgets.service';
import { SavingsGoalsService } from 'src/savings-goals/savings-goals.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reports)
    private readonly reportsRepository: Repository<Reports>,
    private readonly transactionsService: TransactionsService,
    private readonly budgetsService: BudgetsService,
    private readonly savingsGoalsService: SavingsGoalsService,
  ) {}

  /** List all reports for the current user */
  async findAll(
    user: User,
    filters?: {
      month?: number; // 1-12, only for monthly
      year?: number; // full year
      reportType?: ReportType;
      half?: 1 | 2; // 1 = Jan–Jun, 2 = Jul–Dec, only for half-yearly
    },
  ): Promise<Reports[]> {
    const query = this.reportsRepository
      .createQueryBuilder('report')
      .where('report.userId = :userId', { userId: user.id });

    if (filters?.reportType) {
      query.andWhere('report.reportType = :reportType', {
        reportType: filters.reportType,
      });

      if (filters.reportType === ReportType.MONTHLY) {
        if (filters.year) {
          query.andWhere('EXTRACT(YEAR FROM report.periodStart) = :year', {
            year: filters.year,
          });
        }
        if (filters.month) {
          query.andWhere('EXTRACT(MONTH FROM report.periodStart) = :month', {
            month: filters.month,
          });
        }
      }

      if (filters.reportType === ReportType.HALF_YEARLY) {
        if (filters.year) {
          query.andWhere('EXTRACT(YEAR FROM report.periodStart) = :year', {
            year: filters.year,
          });
        }
        if (filters.half) {
          if (filters.half === 1) {
            query.andWhere(
              'EXTRACT(MONTH FROM report.periodStart) BETWEEN 1 AND 6',
            );
          } else {
            query.andWhere(
              'EXTRACT(MONTH FROM report.periodStart) BETWEEN 7 AND 12',
            );
          }
        }
      }

      if (filters.reportType === ReportType.YEARLY) {
        if (filters.year) {
          query.andWhere('EXTRACT(YEAR FROM report.periodStart) = :year', {
            year: filters.year,
          });
        }
      }
    }

    return query.orderBy('report.periodStart', 'DESC').getMany();
  }

  /** Find one report */
  async findOne(id: number, user: User): Promise<Reports> {
    const report = await this.reportsRepository.findOne({
      where: { id: user.id },
    });

    if (!report) throw new NotFoundException(`Report ${id} not found`);
    return report;
  }

  /** Helper: fetch all transactions for a period */
  private async getTransactions(user: User, start: Date, end: Date) {
    const { data } = await this.transactionsService.findAll(user, {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      page: 1,
      limit: 100000, // assume max transactions
    });
    return data;
  }

  /** Generate a new report (monthly, half-yearly, yearly) */
  async create(
    reportType: ReportType,
    user: User,
    month?: number, // 1-12
    year?: number, // full year
    half?: 1 | 2, // optional for half-yearly
  ): Promise<Reports> {
    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    let start: Date;
    let end: Date;

    if (reportType === ReportType.MONTHLY) {
      if (!month) throw new Error('Month is required for monthly reports');
      const targetMonth = month - 1; // JS months are 0-based
      start = new Date(targetYear, targetMonth, 1);
      end = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
    } else if (reportType === ReportType.HALF_YEARLY) {
      const halfValue = half ?? 1; // default to first half
      const startMonth = halfValue === 1 ? 0 : 6; // Jan or Jul
      start = new Date(targetYear, startMonth, 1);
      end = new Date(targetYear, startMonth + 6, 0, 23, 59, 59); // Jun 30 or Dec 31
    } else {
      // YEARLY
      start = new Date(targetYear, 0, 1);
      end = new Date(targetYear, 12, 0, 23, 59, 59); // Dec 31
    }

    // Fetch transactions
    const transactions = await this.getTransactions(user, start, end);

    // --- SUMMARY ---
    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // --- Fetch budgets and savings goals ---
    const { data: budgets } = await this.budgetsService.findAll(user, {
      month,
      year: targetYear,
      page: 1,
      limit: 1000,
    });

    const { data: savingsGoals } = await this.savingsGoalsService.findAll(
      user,
      {
        month,
        year: targetYear,
        page: 1,
        limit: 1000,
      },
    );

    // --- Income / Expense by category ---
    const groupByCategory = (items: any[], type: TransactionType) => {
      const grouped: Record<string, number> = {};
      items
        .filter((t) => t.type === type)
        .forEach((t) => {
          grouped[t.category] = (grouped[t.category] ?? 0) + Number(t.amount);
        });
      return Object.entries(grouped).map(([category, amount]) => ({
        category,
        amount,
        percentage: +(
          (amount /
            (type === TransactionType.INCOME ? totalIncome : totalExpense)) *
            100 || 0
        ).toFixed(2),
      }));
    };

    const incomeByCategory = groupByCategory(
      transactions,
      TransactionType.INCOME,
    );
    const expensesByCategory = groupByCategory(
      transactions,
      TransactionType.EXPENSE,
    );

    // --- Trends ---
    const groupByPeriod = (items: any[], type: TransactionType) => {
      const grouped: Record<string, number> = {};
      items
        .filter((t) => t.type === type)
        .forEach((t) => {
          const periodKey =
            reportType === ReportType.MONTHLY
              ? new Date(t.date).toISOString().split('T')[0]
              : `${new Date(t.date).getMonth() + 1}-${new Date(t.date).getFullYear()}`;
          grouped[periodKey] = (grouped[periodKey] ?? 0) + Number(t.amount);
        });
      return Object.entries(grouped).map(([period, amount]) => ({
        period,
        amount,
      }));
    };

    const incomeTrend = groupByPeriod(transactions, TransactionType.INCOME);
    const expenseTrend = groupByPeriod(transactions, TransactionType.EXPENSE);

    // --- Budgets by category ---
    const budgetsByCategory = budgets.map((b) => {
      const spent = transactions
        .filter((t) => t.category === b.category)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        category: b.category,
        budgeted: Number(b.amount),
        spent,
        percentageUsed: +(b.amount
          ? ((spent / Number(b.amount)) * 100).toFixed(2)
          : 0),
      };
    });

    const overallBudgeted = budgets.reduce(
      (sum, b) => sum + Number(b.amount),
      0,
    );
    const overallSpent = transactions
      .filter((t) => budgets.some((b) => b.category === t.category))
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // --- Calculate savedAmount for savings goals safely ---
    savingsGoals.forEach((g) => {
      g.saved_amount =
        g.transactions
          ?.filter(
            (t) =>
              t.category === ExpenseCategory.SAVINGS_INVESTMENTS &&
              t.type === TransactionType.EXPENSE,
          )
          .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0;
    });

    const reportData = {
      period: {
        type: reportType,
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      },
      summary: {
        totalIncome,
        totalExpense,
        netSavings: totalIncome - totalExpense,
        budgetedAmount: overallBudgeted,
        budgetDifference: overallBudgeted - overallSpent,
        savingsProgress: savingsGoals[0]
          ? {
              targetAmount: savingsGoals[0].target_amount,
              savedAmount: savingsGoals[0].saved_amount,
              percentage: +(
                (savingsGoals[0].saved_amount / savingsGoals[0].target_amount) *
                100
              ).toFixed(2),
            }
          : {},
      },
      income: { byCategory: incomeByCategory, trend: incomeTrend },
      expenses: { byCategory: expensesByCategory, trend: expenseTrend },
      budgets: {
        byCategory: budgetsByCategory,
        overallUsage: {
          budgeted: overallBudgeted,
          spent: overallSpent,
          percentageUsed: +(overallBudgeted
            ? ((overallSpent / overallBudgeted) * 100).toFixed(2)
            : 0),
        },
      },
      savingsGoals: savingsGoals.map((g) => {
        const dueDate = g.due_date ? new Date(g.due_date) : null;
        let status: 'inProgress' | 'completed' | 'overdue' = 'inProgress';
        if (g.saved_amount >= g.target_amount) status = 'completed';
        else if (dueDate && dueDate < new Date()) status = 'overdue';

        return {
          goalName: g.name,
          targetAmount: g.target_amount,
          savedAmount: g.saved_amount,
          percentage: g.target_amount
            ? +((g.saved_amount / g.target_amount) * 100).toFixed(2)
            : 0,
          dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
          status,
        };
      }),
    };

    const report = this.reportsRepository.create({
      reportType,
      periodStart: start.toISOString().split('T')[0],
      periodEnd: end.toISOString().split('T')[0],
      data: reportData,
      user,
    });

    return await this.reportsRepository.save(report);
  }

  async update(reportId: number, user: User): Promise<Reports> {
    // 1. Find the existing report
    const report = await this.reportsRepository.findOne({
      where: { id: reportId, user: { id: user.id } },
    });
    if (!report) throw new NotFoundException(`Report ${reportId} not found`);

    // 2. Determine start & end from the existing report
    const start = new Date(report.periodStart);
    const end = new Date(report.periodEnd);

    // 3. Fetch transactions, budgets, and savings goals for that period
    const transactions = await this.getTransactions(user, start, end);

    const { data: budgets } = await this.budgetsService.findAll(user, {
      month: start.getMonth() + 1, // optional: only for monthly budgets
      year: start.getFullYear(),
      page: 1,
      limit: 1000,
    });

    const { data: savingsGoals } = await this.savingsGoalsService.findAll(
      user,
      {
        month: start.getMonth() + 1, // optional: only for monthly savings goals
        year: start.getFullYear(),
        page: 1,
        limit: 1000,
      },
    );

    // 4. Recompute the report data
    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Group by category
    const groupByCategory = (items: any[], type: TransactionType) => {
      const grouped: Record<string, number> = {};
      items
        .filter((t) => t.type === type)
        .forEach((t) => {
          grouped[t.category] = (grouped[t.category] ?? 0) + Number(t.amount);
        });
      return Object.entries(grouped).map(([category, amount]) => ({
        category,
        amount,
        percentage: +(
          (amount /
            (type === TransactionType.INCOME ? totalIncome : totalExpense)) *
            100 || 0
        ).toFixed(2),
      }));
    };

    const incomeByCategory = groupByCategory(
      transactions,
      TransactionType.INCOME,
    );
    const expensesByCategory = groupByCategory(
      transactions,
      TransactionType.EXPENSE,
    );

    // Trends
    const groupByPeriod = (items: any[], type: TransactionType) => {
      const grouped: Record<string, number> = {};
      items
        .filter((t) => t.type === type)
        .forEach((t) => {
          const periodKey =
            report.reportType === ReportType.MONTHLY
              ? new Date(t.date).toISOString().split('T')[0]
              : `${new Date(t.date).getMonth() + 1}-${new Date(t.date).getFullYear()}`;
          grouped[periodKey] = (grouped[periodKey] ?? 0) + Number(t.amount);
        });
      return Object.entries(grouped).map(([period, amount]) => ({
        period,
        amount,
      }));
    };

    const incomeTrend = groupByPeriod(transactions, TransactionType.INCOME);
    const expenseTrend = groupByPeriod(transactions, TransactionType.EXPENSE);

    // Budgets by category
    const budgetsByCategory = budgets.map((b) => ({
      category: b.category,
      budgeted: Number(b.amount),
      spent: transactions
        .filter((t) => t.category === b.category)
        .reduce((sum, t) => sum + Number(t.amount), 0),
      percentageUsed: +(
        (transactions
          .filter((t) => t.category === b.category)
          .reduce((sum, t) => sum + Number(t.amount), 0) /
          Number(b.amount)) *
          100 || 0
      ).toFixed(2),
    }));

    const overallBudgeted = budgets.reduce(
      (sum, b) => sum + Number(b.amount),
      0,
    );
    const overallSpent = transactions
      .filter((t) => budgets.some((b) => b.category === t.category))
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Savings goals
    savingsGoals.forEach((g) => {
      g.saved_amount =
        g.transactions
          ?.filter(
            (t) =>
              t.category === ExpenseCategory.SAVINGS_INVESTMENTS &&
              t.type === TransactionType.EXPENSE,
          )
          .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0;
    });

    const reportData = {
      period: report.data.period,
      summary: {
        totalIncome,
        totalExpense,
        netSavings: totalIncome - totalExpense,
        budgetedAmount: overallBudgeted,
        budgetDifference: overallBudgeted - overallSpent,
        savingsProgress: savingsGoals[0]
          ? {
              targetAmount: savingsGoals[0].target_amount,
              savedAmount: savingsGoals[0].saved_amount,
              percentage: +(
                (savingsGoals[0].saved_amount / savingsGoals[0].target_amount) *
                100
              ).toFixed(2),
            }
          : {},
      },
      income: { byCategory: incomeByCategory, trend: incomeTrend },
      expenses: { byCategory: expensesByCategory, trend: expenseTrend },
      budgets: {
        byCategory: budgetsByCategory,
        overallUsage: {
          budgeted: overallBudgeted,
          spent: overallSpent,
          percentageUsed: +(
            (overallSpent / overallBudgeted) * 100 || 0
          ).toFixed(2),
        },
      },
      savingsGoals: savingsGoals.map((g) => {
        const dueDate = new Date(g.due_date);
        let status: 'inProgress' | 'completed' | 'overdue' = 'inProgress';
        if (g.saved_amount >= g.target_amount) status = 'completed';
        else if (dueDate < new Date()) status = 'overdue';

        return {
          goalName: g.name,
          targetAmount: g.target_amount,
          savedAmount: g.saved_amount,
          percentage: +((g.saved_amount / g.target_amount) * 100).toFixed(2),
          dueDate: dueDate.toISOString().split('T')[0],
          status,
        };
      }),
    };

    // 5. Update the report
    report.data = reportData;
    return this.reportsRepository.save(report);
  }

  async remove(id: number, user: User): Promise<void> {
    const report = await this.findOne(id, user);
    await this.reportsRepository.remove(report);
  }

  /** Export report as PDF/CSV */
  async export(id: number, format: ExportFormat, user: User): Promise<Buffer> {
    const report = await this.findOne(id, user);
    return ReportExport.exportReport(report, format);
  }

  /** Helper: group expenses by category */
  private groupExpenses(transactions: any[]) {
    const grouped: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'EXPENSE')
      .forEach((t) => {
        grouped[t.category] = (grouped[t.category] ?? 0) + Number(t.amount);
      });
    return grouped;
  }

  /** Top 3 categories by spending */
  async topCategories(user: User, month?: number, year?: number) {
    const start = new Date(
      year ?? new Date().getFullYear(),
      (month ?? 1) - 1,
      1,
    );
    const end = new Date(year ?? new Date().getFullYear(), month ?? 12, 31);

    const transactions = await this.getTransactions(user, start, end);
    const groupedExpenses = this.groupExpenses(transactions);

    return Object.entries(groupedExpenses)
      .sort(([, totalA], [, totalB]) => totalB - totalA)
      .slice(0, 3)
      .map(([category, total]) => ({ category, total }));
  }

  /** Category charts (pie/bar data) */
  async categoryCharts(user: User, month?: number, year?: number) {
    const start = new Date(
      year ?? new Date().getFullYear(),
      (month ?? 1) - 1,
      1,
    );
    const end = new Date(year ?? new Date().getFullYear(), month ?? 12, 31);

    const transactions = await this.getTransactions(user, start, end);
    const groupedExpenses = this.groupExpenses(transactions);

    return Object.entries(groupedExpenses).map(([category, value]) => ({
      category,
      value,
    }));
  }
}
