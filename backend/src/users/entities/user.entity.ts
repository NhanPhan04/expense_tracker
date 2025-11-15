import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, Length, IsEnum } from 'class-validator';


export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
    [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) // trước đây nullable: false
  @Length(3, 50)
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ nullable: true })   // <-- sửa ở đây
  avatar?: string;  
 // URL hoặc tên file ảnh

 @Column({ nullable: true, type: 'varchar' })
  otp: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  otpExpire: Date | null;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;
}
