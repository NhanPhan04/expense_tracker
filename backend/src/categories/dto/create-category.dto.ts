// src/category/dto/create-category.dto.ts
import { IsString, IsEnum, IsOptional } from 'class-validator';

export type CategoryType = 'income' | 'expense';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(['income', 'expense'])
  type: CategoryType;

  @IsOptional()
  userId?: number; // Nếu muốn gán cho user
}
