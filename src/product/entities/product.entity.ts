import { BaseEntity } from "../../common/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { ProductVariant } from "./product-variant.entity";
import { Review } from "src/review/entities/review.entity";

@Entity('products')
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ unique: true })
    slug: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({
        type: 'decimal',
        precision: 3,
        scale: 2,
        default: 0
    })
    averageRating: number; // Guardará valores como 4.50, 3.85, etc.

    @Column({
        type: 'int',
        default: 0
    })
    totalReviews: number; // Contador simple de reseñas

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
    variant: ProductVariant[];

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];
}