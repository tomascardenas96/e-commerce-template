import { Test, TestingModule } from '@nestjs/testing';
import { UserDiscountService } from './services/user-discount.service';

describe('UserDiscountService', () => {
  let service: UserDiscountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDiscountService],
    }).compile();

    service = module.get<UserDiscountService>(UserDiscountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
