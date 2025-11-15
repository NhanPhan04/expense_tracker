// src/transaction/transaction.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createDto: CreateTransactionDto, @GetUser() user: User) {
    return this.transactionService.create(createDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.transactionService.findOne(id, user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateTransactionDto, @GetUser() user: User) {
    return this.transactionService.update(id, updateDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @GetUser() user: User) {
    return this.transactionService.remove(id, user);
  }

  @Get()
  findAll(
    @GetUser() user: User,
    @Query('month') month?: string,
    @Query('type') type?: 'income' | 'expense',
    @Query('categoryId') categoryId?: number,
    @Query('search') search?: string,
  ) {
    return this.transactionService.findAll(user, month, type, categoryId, search);
  }

  @Get('summary/:month')
  getMonthlySummary(@Param('month') month: string, @GetUser() user: User) {
    return this.transactionService.getMonthlySummary(user, month);
  }

  @Get('day/:date')
  findByDate(@Param('date') date: string, @GetUser() user: User) {
    return this.transactionService.findByDate(user, date);
  }
}
