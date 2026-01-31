import { Module } from '@nestjs/common';
import { ShippingMethodService } from './services/shipping-method.service';
import { ShippingMethodController } from './controllers/shipping-method.controller';

@Module({
  controllers: [ShippingMethodController],
  providers: [ShippingMethodService],
})
export class ShippingMethodModule { }
