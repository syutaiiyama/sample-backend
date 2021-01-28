import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { LoggerModule } from '../../common/logger/logger.module';
import { ProductImageModule } from '../product/product-image/product-image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), ProductImageModule, LoggerModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
