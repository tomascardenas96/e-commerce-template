import { Module } from '@nestjs/common';
import { CartItemService } from './services/cart-item.service';
import { CartItemController } from './controllers/cart-item.controller';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule { }
