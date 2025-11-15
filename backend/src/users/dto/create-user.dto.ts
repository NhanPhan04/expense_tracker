// dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsEnum, Length } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty() @Length(3, 50) name: string;
  @IsEmail() email: string;
  @IsNotEmpty() @Length(6, 20) password: string;
  @IsEnum(UserRole) role: UserRole;
}
