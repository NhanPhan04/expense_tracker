// src/transaction/dto/create-transaction.dto.ts
import { IsNumber, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import type { TransactionType } from '../entities/transaction.entity'; // dùng import type

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsEnum(['income', 'expense'])
  type: TransactionType;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber()
  categoryId: number;
}
