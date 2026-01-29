import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Order } from "../../order/entities/order.entity";
import { DiscountType } from "../enums/discount-type.enum";

@Entity('discounts')
export class Discount extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column({ type: 'enum', enum: DiscountType })
    type: DiscountType;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    value: number; // El valor del 15.00 o 10.00 según el tipo

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    minOrderAmount: number; // Compra mínima para que el cupón funcione

    @Column({ type: 'int', nullable: true })
    usageLimit: number; // Cuántas veces se puede usar el cupón en total

    @Column({ type: 'int', default: 0 })
    usedCount: number; // Cuántas veces se ha usado ya

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Order, (order) => order.discount)
    orders: Order[];
}