import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './product-image.entity';
import { LoggerModule } from '../../../common/logger/logger.module';
import { AuthModule } from '../../../common/auth/auth.module';
import { StorageModule } from '../../storage/storage.module';

@Module({
  imports: [
    StorageModule.register({
      storageRecordType: 'ProductImage',
      googleCloudStorageOptions: {
        useBucketName:
          process.env.NEST_APP_GOOGLE_CLOUD_STORAGE_BUCKET_NAME_ASSET,
        urlExpiresMinutes: 30,
      },
    }),
    TypeOrmModule.forFeature([ProductImage]),
    LoggerModule,
    AuthModule,
  ],
  controllers: [ProductImageController],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}
