import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { AuthModule } from './auth/auth.module';
import { TokenGuard } from './auth/guard/token.guard';
import { CartItemModule } from './cart-item/cart-item.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { UserExistsGuard } from './common/guards/user-exists.guard';
import { dataSourceOptions } from './data-source';
import { DiscountModule } from './discount/discount.module';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { NotificationModule } from './notification/notification.module';
import { OrderAddressModule } from './order-address/order-address.module';
import { OrderItemModule } from './order-item/order-item.module';
import { OrderModule } from './order/order.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PaymentModule } from './payment/payment.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { ProductModule } from './product/product.module';
import { ProfileModule } from './profile/profile.module';
import { ReviewModule } from './review/review.module';
import { RoleModule } from './role/role.module';
import { ShippingMethodModule } from './shipping-method/shipping-method.module';
import { ShippingModule } from './shipping/shipping.module';
import { UserAddressModule } from './user-address/user-address.module';
import { UserDiscountModule } from './user-discount/user-discount.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Para verificar en que enviroment se esta ejecutando la app.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // Conexion con la DB.
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),

    TypeOrmModule.forFeature([User]),

    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    UserModule,
    AuthModule,
    MailModule,
    HealthModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    ShippingModule,
    DiscountModule,
    ReviewModule,
    NotificationModule,
    CategoryModule,
    ProductVariantModule,
    CartItemModule,
    UserDiscountModule,
    OrderAddressModule,
    OrderItemModule,
    PaymentMethodModule,
    ProfileModule,
    RoleModule,
    UserAddressModule,
    ShippingMethodModule
  ],

  providers: [
    MailService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard // 1. ¿Viene muy rápido?
    },
    {
      provide: APP_GUARD,
      useClass: TokenGuard // 2. ¿Quién es?
    },
    {
      provide: APP_GUARD,
      useClass: UserExistsGuard // 3. ¿Todavía existe?
    },
  ],
})
export class AppModule { }
