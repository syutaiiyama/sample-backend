import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './data/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './data/user/address/address.module';
import { StripePaymentModule } from './data/stripe-payment/stripe-payment.module';
import { ProductModule } from './data/product/product.module';
import { ProductImageModule } from './data/product/product-image/product-image.module';
import { CartModule } from './data/cart/cart.module';
import { OrderModule } from './data/order/order.module';
import { TypeOrmConfigService } from './infra/rdb/typeOrmConfig.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      isGlobal: true,
    }),
    UserModule,
    AddressModule,
    StripePaymentModule,
    ProductModule,
    ProductImageModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
