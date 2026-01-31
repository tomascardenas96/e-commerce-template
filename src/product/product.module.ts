import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';
import { ProductService } from './services/product.service';
import { CategoryModule } from '../category/category.module';
import { ProductVariantModule } from 'src/product-variant/product-variant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    ProductVariantModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
