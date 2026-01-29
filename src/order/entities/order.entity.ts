import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "../../cart/entities/cart.entity";
import { BaseEntity } from "../../common/entities/base.entity";
import { Discount } from "../../discount/entities/discount.entity";
import { Payment } from "../../payment/entities/payment.entity";
import { Shipment } from "../../shipping/entities/shipment.entity";
import { User } from "../../user/entities/user.entity";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderAddress } from "./order-address.entity";
import { OrderItem } from "./order-item.entity";

@Entity('orders')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    orderNumber: string;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    totalAmount: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    discountAmount: number;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @OneToOne(() => Cart)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @OneToOne(() => OrderAddress, (address) => address.order, { cascade: true, eager: true })
    @JoinColumn({ name: 'shipping_address_id' })
    shippingAddress: OrderAddress;

    @OneToMany(() => Payment, (payment) => payment.order)
    payments: Payment[];

    @OneToOne(() => Shipment, (shipment) => shipment.order)
    shipment: Shipment;

    @ManyToOne(() => Discount, (discount) => discount.orders, { nullable: true })
    @JoinColumn({ name: 'discount_id' })
    discount: Discount;
}