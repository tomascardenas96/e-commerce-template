import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Cart } from "./cart.entity";
import { ProductVariant } from "src/product/entities/product-variant.entity";

@Entity('cart_items')
export class CartItem extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @ManyToOne(() => ProductVariant, { eager: true })
    @JoinColumn({ name: 'variant_id' })
    variant: ProductVariant;
}