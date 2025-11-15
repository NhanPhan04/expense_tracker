// src/category/entities/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type CategoryType = 'income' | 'expense';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
        
    @Column({ type: 'enum', enum: ['income', 'expense'] })
    type: CategoryType;

@ManyToOne(() => User, (user) => user.categories, { nullable: true })
user: User | null;   // phải thêm "| null"


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
