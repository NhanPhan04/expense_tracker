// src/transaction/entities/transaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

export type TransactionType = 'income' | 'expense';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: TransactionType;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(() => Category, { eager: true })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
