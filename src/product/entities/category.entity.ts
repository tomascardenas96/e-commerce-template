import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Product } from "./product.entity";

@Entity('categories')
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    slug: string;

    @ManyToOne(() => Category, (category) => category.subCategories, { nullable: true })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    subCategories: Category[];

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}