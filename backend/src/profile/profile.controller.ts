import { Controller, Get, Patch, Delete, Body, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.id);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto, @UploadedFile() file: Express.Multer.File) {
    if (file) dto.avatar = `/uploads/avatars/${file.filename}`;
    return this.profileService.updateProfile(req.user.id, dto);
  }

  @Delete()
  deleteProfile(@Req() req) {
    return this.profileService.deleteProfile(req.user.id);
  }
}
