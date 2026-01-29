import { Product } from "src/product/entities/product.entity";
import { BaseEntity } from "../../common/entities/base.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity('reviews')
@Index(['user', 'product'], { unique: true })
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ default: false })
    isVerifiedPurchase: boolean; // Se marca true si el sistema detecta que el usuario compró el producto

    @Column({ default: true })
    isActive: boolean; // Para moderación (ocultar reseñas ofensivas)

    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Product, (product) => product.reviews)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}