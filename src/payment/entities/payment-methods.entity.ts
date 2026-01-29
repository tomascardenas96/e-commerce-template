import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../../user/entities/user.entity";

@Entity('payment_methods')
export class PaymentMethod extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider: string; // 'stripe', etc.

    @Column()
    externalPaymentId: string; // El ID del "Customer" o "Card" en el proveedor

    @Column()
    last4: string; // Solo para mostrar en el frontend (ej: "**** 1234")

    @Column()
    brand: string; // 'visa', 'mastercard'

    @ManyToOne(() => User, (user) => user.paymentMethods)
    @JoinColumn({ name: 'user_id' })
    user: User;
}