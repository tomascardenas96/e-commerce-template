
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { Order } from '../../order/entities/order.entity';
import { PaymentMethod } from '../../payment-method/entities/payment-method.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { Review } from '../../review/entities/review.entity';
import { Role } from '../../role/entities/role.entity';
import { UserAddress } from '../../user-address/entities/user-address.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, unique: true })
  phone?: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

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

  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  profile: Profile;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => UserAddress, (address) => address.user)
  addresses: UserAddress[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[]

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
  paymentMethods: PaymentMethod[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
