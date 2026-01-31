import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Order } from "../../order/entities/order.entity";
import { ShipmentStatus } from "../enums/shipment-status.enum";
import { ShippingMethod } from "../../shipping-method/entities/shipping-method.entity";

@Entity('shipments')
export class Shipment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: ShipmentStatus, default: ShipmentStatus.PENDING })
    status: ShipmentStatus;

    @Column({ nullable: true })
    trackingNumber: string;

    @Column({ nullable: true })
    carrier: string; // La empresa (ej: 'Expreso TAS', 'Correo Argentino')

    @Column({ type: 'timestamp', nullable: true })
    shippedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deliveredAt: Date;

    @OneToOne(() => Order, (order) => order.shipment)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => ShippingMethod)
    @JoinColumn({ name: 'shipping_method_id' })
    method: ShippingMethod;
}