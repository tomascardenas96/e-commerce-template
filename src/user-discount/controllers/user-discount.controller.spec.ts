import { Test, TestingModule } from '@nestjs/testing';
import { UserDiscountController } from './user-discount.controller';
import { UserDiscountService } from '../services/user-discount.service';

describe('UserDiscountController', () => {
  let controller: UserDiscountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDiscountController],
      providers: [UserDiscountService],
    }).compile();

    controller = module.get<UserDiscountController>(UserDiscountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
