// src/transaction/transaction.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  // Tạo giao dịch mới
  async create(createDto: CreateTransactionDto, user: User): Promise<Transaction> {
    const category = await this.categoryRepo.findOneBy({ id: createDto.categoryId });
    if (!category) throw new NotFoundException('Category not found');

    const transaction = this.transactionRepo.create({
      amount: createDto.amount,
      type: createDto.type,
      date: createDto.date,
      note: createDto.note,
      user,
      category,
    });

    return this.transactionRepo.save(transaction);
  }

  // Lấy tất cả giao dịch của user
  async findAll(user: User, month?: string, type?: TransactionType, categoryId?: number, search?: string) {
    const query = this.transactionRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'category')
      .where('t.userId = :userId', { userId: user.id });

    if (month) {
        const monthStr = month.substring(0, 7);
      query.andWhere('to_char(t.date, \'YYYY-MM\') = :month', { month });
    }
    if (type) {
      query.andWhere('t.type = :type', { type });
    }
    if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }
    if (search) {
      query.andWhere('t.note ILIKE :search', { search: `%${search}%` });
    }

    return query.orderBy('t.date', 'DESC').getMany();
  }

  // Lấy chi tiết giao dịch
  async findOne(id: number, user: User) {
    const transaction = await this.transactionRepo.findOne({
      where: { id, user: { id: user.id } },
      relations: ['category'],
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  // Cập nhật giao dịch
  async update(id: number, updateDto: UpdateTransactionDto, user: User) {
    const transaction = await this.findOne(id, user);
    if (updateDto.categoryId) {
      const category = await this.categoryRepo.findOneBy({ id: updateDto.categoryId });
      if (!category) throw new NotFoundException('Category not found');
      transaction.category = category;
    }
    Object.assign(transaction, updateDto);
    return this.transactionRepo.save(transaction);
  }

  // Xóa giao dịch
  async remove(id: number, user: User) {
    const transaction = await this.findOne(id, user);
    await this.transactionRepo.remove(transaction);
    return { success: true };
  }

  // Lấy summary theo tháng (tổng thu/chi)
  async getMonthlySummary(user: User, month: string) {
    const transactions = await this.findAll(user, month);
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Tính daily summary (cho calendar)
    const dailySummary: { date: string; income: number; expense: number }[] = [];
    const grouped: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      if (!grouped[t.date]) grouped[t.date] = { income: 0, expense: 0 };
      grouped[t.date][t.type] += Number(t.amount);
    });
    for (const date in grouped) {
      dailySummary.push({ date, income: grouped[date].income, expense: grouped[date].expense });
    }

    return {
      month,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      dailySummary,
      transactions,
    };
  }

  // Lấy giao dịch theo ngày
  async findByDate(user: User, date: string) {
    return this.transactionRepo.find({
      where: { user: { id: user.id }, date },
      relations: ['category'],
      order: { date: 'ASC' },
    });
  }
}
