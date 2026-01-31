import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity('user_addresses')
export class UserAddress extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    country: string;

    @Column()
    state: string;

    @Column()
    city: string;

    @Column()
    addressLine: string;

    @Column({ nullable: true })
    zipCode: string;

    @Column({ default: false })
    isDefault: boolean;

    @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}