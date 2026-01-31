import { Module } from '@nestjs/common';
import { UserAddressService } from './services/user-address.service';
import { UserAddressController } from './controllers/user-address.controller';

@Module({
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule { }
