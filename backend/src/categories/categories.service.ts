// src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category, CategoryType } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  // Lấy tất cả category (global + user-specific)
  async findAll(user: User, type?: CategoryType) {
    const query = this.categoryRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'user')
      .where('c.userId IS NULL OR c.userId = :userId', { userId: user.id });

    if (type) {
      query.andWhere('c.type = :type', { type });
    }

    return query.orderBy('c.name', 'ASC').getMany();
  }

  // Lấy category theo id (global hoặc user-specific)

async findOne(id: number, user: User) {
  const category = await this.categoryRepo.findOne({
    where: [
      { id, user: { id: user.id } }, // category của user
     { id, user: IsNull() },              // category global
    ],
  });

  if (!category) throw new NotFoundException('Category not found');
  return category;
}


  // Tạo category mới (user-specific)
  async create(createDto: CreateCategoryDto, user: User) {
    const category = this.categoryRepo.create({
      name: createDto.name,
      type: createDto.type,
      user, // liên kết user
    });
    return this.categoryRepo.save(category);
  }

  // Cập nhật category
  async update(id: number, updateDto: UpdateCategoryDto, user: User) {
    const category = await this.findOne(id, user);
    Object.assign(category, updateDto);
    return this.categoryRepo.save(category);
  }

  // Xóa category
async remove(id: number, user: User) {
  const category = await this.findOne(id, user);
  await this.categoryRepo.remove(category);
  return { success: true };
}
}


