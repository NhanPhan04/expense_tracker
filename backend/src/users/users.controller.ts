// users/users.controller.ts
import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id/reset-password')
  resetPassword(@Param('id') id: number, @Body('newPassword') newPassword: string) {
    return this.usersService.resetPassword(id, newPassword);
  }
}
