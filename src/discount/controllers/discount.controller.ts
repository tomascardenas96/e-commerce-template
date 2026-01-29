import { Controller } from '@nestjs/common';
import { DiscountService } from '../services/discount.service';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) { }
}
