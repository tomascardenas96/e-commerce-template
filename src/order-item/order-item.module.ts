import { Module } from '@nestjs/common';
import { OrderItemService } from './services/order-item.service';
import { OrderItemController } from './controllers/order-item.controller';

@Module({
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule { }
