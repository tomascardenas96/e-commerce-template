import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../order/entities/order.entity";

@Entity('order_addresses')
export class OrderAddress extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    receiverName: string;

    @Column()
    phone: string;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column({ name: 'zip_code' })
    zipCode: string;

    @Column()
    country: string;

    @Column({ nullable: true })
    additionalInfo: string; // Ej: "Casa de rejas blancas"

    @OneToOne(() => Order, (order) => order.shippingAddress)
    order: Order;
}