// src/transaction/transaction.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Category])],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
