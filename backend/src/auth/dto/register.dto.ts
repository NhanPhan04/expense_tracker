import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';
import { Match } from '../../common/decorators/match.decorator';


export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  @Match('password', { message: 'Confirm password không khớp' })
  confirmPassword: string;

  role?: UserRole;
}