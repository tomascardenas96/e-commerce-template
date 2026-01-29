import { Module } from '@nestjs/common';
import { DiscountService } from './services/discount.service';
import { DiscountController } from './controllers/discount.controller';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule { }
