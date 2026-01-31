import { Module } from '@nestjs/common';
import { ProductVariantService } from './services/product-variant.service';
import { ProductVariantController } from './controllers/product-variant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  exports: [ProductVariantService]
})
export class ProductVariantModule { }
