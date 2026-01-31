import { Module } from '@nestjs/common';
import { UserDiscountService } from './services/user-discount.service';
import { UserDiscountController } from './controllers/user-discount.controller';

@Module({
  controllers: [UserDiscountController],
  providers: [UserDiscountService],
})
export class UserDiscountModule { }
