
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';
import { RolesEnum } from 'src/common/enum/roles.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true, unique: true })
  phone?: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: RolesEnum.MEMBER })
  role: RolesEnum;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ nullable: true })
  picture?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true, select: false })
  resetToken: string;

  @Column({ default: 0 })
  failedAttempts: number;

  @Column({ type: 'timestamptz', nullable: true })
  lockedUntil: Date | null;
}
