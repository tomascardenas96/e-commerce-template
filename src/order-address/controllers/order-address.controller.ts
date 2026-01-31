import { Controller } from '@nestjs/common';
import { OrderAddressService } from '../services/order-address.service';

@Controller('order-address')
export class OrderAddressController {
  constructor(private readonly orderAddressService: OrderAddressService) { }
}
