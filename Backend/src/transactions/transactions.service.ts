import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactions } from './transactions.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from 'src/auth/user.entity';
import { FindTransactionsDto } from './dto/find-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
  ) {}
  /** Create a new transaction */
  async create(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ): Promise<Transactions> {
    const transaction = this.transactionsRepository.create({
      type: createTransactionDto.type,
      category: createTransactionDto.category,
      amount: createTransactionDto.amount,
      date: new Date(createTransactionDto.date),
      description: createTransactionDto.description,
      recurring: createTransactionDto.recurring ?? false,
      recurring_interval: createTransactionDto.recurring_interval,
      user: { id: user.id }, // relation to user
      savingsGoal: createTransactionDto.savingsGoalId
        ? { id: createTransactionDto.savingsGoalId } // ⚡ link savings goal
        : null,
    } as Partial<Transactions>);

    return this.transactionsRepository.save(transaction);
  }

  /** Find all transactions with optional filters */
  async findAll(
    user: User,
    filters?: FindTransactionsDto,
  ): Promise<{
    data: Transactions[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 25;
    const skip = (page - 1) * limit;

    const query = this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId: user.id });

    if (filters?.type) {
      query.andWhere('transaction.type = :type', { type: filters.type });
    }

    if (filters?.category) {
      query.andWhere('transaction.category = :category', {
        category: filters.category,
      });
    }

    if (filters?.startDate) {
      query.andWhere('transaction.date >= :startDate', {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters?.endDate) {
      query.andWhere('transaction.date <= :endDate', {
        endDate: new Date(filters.endDate),
      });
    }

    const [data, total] = await query
      .orderBy('transaction.updated_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  /** Find a single transaction by numeric ID */
  async findOne(id: number, user: User): Promise<Transactions> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${id} not found for this user`,
      );
    }

    return transaction;
  }

  /** Remove a transaction */
  async remove(id: number, user: User): Promise<void> {
    const transaction = await this.findOne(id, user);
    await this.transactionsRepository.remove(transaction);
  }

  /** Update a transaction */
  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    user: User,
  ): Promise<Transactions> {
    const transaction = await this.findOne(id, user);

    if (updateTransactionDto.date) {
      // eslint-disable-next-line no-self-assign
      updateTransactionDto.date = updateTransactionDto.date;
    }

    Object.assign(transaction, updateTransactionDto);
    return this.transactionsRepository.save(transaction);
  }
}
