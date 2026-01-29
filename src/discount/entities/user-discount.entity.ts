import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Discount } from "./discount.entity";

@Entity('user_discounts')
@Index(['user', 'discount'], { unique: true })
export class UserDiscount extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Discount)
    discount: Discount;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    usedAt: Date;
}