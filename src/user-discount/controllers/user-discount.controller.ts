import { Controller } from '@nestjs/common';
import { UserDiscountService } from '../services/user-discount.service';

@Controller('user-discount')
export class UserDiscountController {
  constructor(private readonly userDiscountService: UserDiscountService) { }
}
