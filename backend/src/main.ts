import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './users/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);

  const adminEmail = 'admin123@example.com';
  const adminExist = await userRepo.findOne({ where: { email: adminEmail } });
  if (!adminExist) {
    const admin = userRepo.create({
      name: 'Admin',
      email: adminEmail,
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log('✅ Admin mặc định đã được tạo: admin123@example.com / admin123');
  } 

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
