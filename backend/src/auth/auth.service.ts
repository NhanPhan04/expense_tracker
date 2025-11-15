import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

 async register(dto: RegisterDto): Promise<User> {

  const exist = await this.userRepo.findOne({ where: { email: dto.email } });
  if (exist) throw new BadRequestException('Email đã tồn tại');

  const hashed = await bcrypt.hash(dto.password, 10);

  const user = this.userRepo.create({
    name: dto.name,
    email: dto.email,
    password: hashed,
    role: dto.role || UserRole.USER,
  });

  return this.userRepo.save(user);
}


  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new BadRequestException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { access_token: token };
  }

  async forgetPassword(dto: ForgetPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    await this.userRepo.save(user);

    // gửi mail
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
        },
    });

    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'OTP reset password',
    text: `Your OTP code is: ${otp}`,
    });

    return { message: 'OTP sent to email' };
}

async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');
    if (!user.otp || !user.otpExpire) throw new BadRequestException('OTP not found');
    if (user.otpExpire < new Date()) throw new BadRequestException('OTP expired');
    if (user.otp !== dto.otp) throw new BadRequestException('Invalid OTP');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.otp = null;
    user.otpExpire = null;

    await this.userRepo.save(user);
    return { message: 'Password reset successfully' };
}
}
