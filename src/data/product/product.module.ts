import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { LoggerModule } from '../../common/logger/logger.module';
import { ProductImageModule } from './product-image/product-image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    LoggerModule,
    ProductImageModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
