import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Order } from "../../order/entities/order.entity";
import { User } from "../../user/entities/user.entity";
import { PaymentStatus } from "../enums/payment-status.enum";

@Entity('payments')
export class Payment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    method: string; // Ej: 'stripe', 'paypal', 'mercadopago'

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    transactionId: string; // El ID que te devuelve la pasarela externa

    @Column({ type: 'jsonb', nullable: true })
    rawResponse: any; // Guardamos la respuesta cruda de la API externa por si hay errores

    @ManyToOne(() => Order, (order) => order.payments)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}