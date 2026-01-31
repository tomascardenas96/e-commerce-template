import { Controller } from '@nestjs/common';
import { CartItemService } from '../services/cart-item.service';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) { }
}
