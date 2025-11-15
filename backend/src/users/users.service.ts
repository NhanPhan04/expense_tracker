// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  updateRole(arg0: number, role: string) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find({ select: ['id', 'name', 'email', 'role', 'createdAt'] });
  }

  async update(id: number, dto: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User không tồn tại');
    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User không tồn tại');
    return this.repo.remove(user);
  }

  async resetPassword(id: number, newPassword: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User không tồn tại');
    user.password = await bcrypt.hash(newPassword, 10);
    return this.repo.save(user);
  }
}
