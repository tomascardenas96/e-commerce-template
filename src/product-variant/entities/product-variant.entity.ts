import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Product } from "../../product/entities/product.entity";

@Entity('product_variants')
export class ProductVariant extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    sku: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ type: 'jsonb', nullable: true })
    attributes: Record<string, any>;

    @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
    product: Product;
}