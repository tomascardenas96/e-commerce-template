import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { AuthModule } from './auth/auth.module';
import { TokenGuard } from './auth/guard/token.guard';
import { UserExistsGuard } from './common/guards/user-exists.guard';
import { dataSourceOptions } from './data-source';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ShippingModule } from './shipping/shipping.module';
import { DiscountModule } from './discount/discount.module';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';

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
    NotificationModule
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
