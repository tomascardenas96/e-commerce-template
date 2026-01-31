import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('shipping_methods')
export class ShippingMethod extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // Ej: 'DHL Express', 'Standard Shipping'

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column()
    estimatedDays: string; // Ej: '2-3 dias habiles'

    @Column({ default: true })
    isActive: boolean;
}