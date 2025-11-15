// src/category/category.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@GetUser() user: User, @Query('type') type?: 'income' | 'expense') {
    return this.categoryService.findAll(user, type);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.categoryService.findOne(id, user);
  }

  @Post()
  create(@Body() createDto: CreateCategoryDto, @GetUser() user: User) {
    return this.categoryService.create(createDto, user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateCategoryDto, @GetUser() user: User) {
    return this.categoryService.update(id, updateDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @GetUser() user: User) {
    return this.categoryService.remove(id, user);
  }
}
