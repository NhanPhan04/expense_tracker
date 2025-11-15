import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { TransactionModule } from './transactions/transactions.module';
import { CategoryModule } from './categories/categories.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      autoLoadEntities: true,
      synchronize: true, // Lúc phát triển bật true để tạo bảng tự động
    }),
    TypeOrmModule.forFeature([User]),
    
    AuthModule,
    UsersModule,
    ProfileModule,
    TransactionModule,
    CategoryModule,
  ],
})
export class AppModule {}
