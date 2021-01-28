import { Module } from '@nestjs/common';
import { OrderedProductService } from './ordered-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedProduct } from './ordered-product.entity';
import { LoggerModule } from '../../../common/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderedProduct]), LoggerModule],
  providers: [OrderedProductService],
  exports: [OrderedProductService],
})
export class OrderedProductModule {}
