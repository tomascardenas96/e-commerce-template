import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../../user/entities/user.entity";
import { CartStatus } from "../enums/cart-status.enum";
import { CartItem } from "./cart-item.entity";

@Entity('carts')
@Index(['user', 'status'], { unique: true, where: "status = 'open'" })
export class Cart extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: CartStatus,
        default: CartStatus.OPEN
    })
    status: CartStatus;

    @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
    items: CartItem[];

    // Propiedad calculada para saber el total del carrito en el momento
    get totalItems(): number {
        return this.items ? this.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    }
}