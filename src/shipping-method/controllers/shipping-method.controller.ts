import { Controller } from '@nestjs/common';
import { ShippingMethodService } from '../services/shipping-method.service';

@Controller('shipping-method')
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) { }
}
