import { Module } from '@nestjs/common';
import { OrderAddressService } from './services/order-address.service';
import { OrderAddressController } from './controllers/order-address.controller';

@Module({
  controllers: [OrderAddressController],
  providers: [OrderAddressService],
})
export class OrderAddressModule { }
