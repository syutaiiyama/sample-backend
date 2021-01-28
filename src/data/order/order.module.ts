import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { LoggerModule } from '../../common/logger/logger.module';
import { CartModule } from '../cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { OrderedProductModule } from './ordered-product/ordered-product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    LoggerModule,
    CartModule,
    OrderedProductModule,
    PaymentModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
