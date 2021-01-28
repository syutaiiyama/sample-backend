import { DynamicModule, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { GoogleCloudStorageModule } from '../../infra/google-cloud-storage/google-cloud-storage.module';
import { StorageOptions } from './interface/storage.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { LoggerModule } from '../../common/logger/logger.module';
import { STORAGE_OPTIONS } from './storage.constants';

@Module({})
export class StorageModule {
  static register(options: StorageOptions): DynamicModule {
    return {
      module: StorageModule,
      imports: [
        TypeOrmModule.forFeature([Storage]),
        GoogleCloudStorageModule.register(options.googleCloudStorageOptions),
        LoggerModule,
      ],
      providers: [
        {
          provide: STORAGE_OPTIONS,
          useValue: options,
        },
        StorageService,
      ],
      exports: [StorageService],
    };
  }
}
