import { DynamicModule, Module } from '@nestjs/common';
import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { GOOGLE_CLOUD_STORAGE_OPTIONS } from './google-cloud-storage.constant';
import { GoogleCloudStorageOptions } from './interface/google-cloud-storage-options.interface';

@Module({})
export class GoogleCloudStorageModule {
  static register(options: GoogleCloudStorageOptions): DynamicModule {
    return {
      module: GoogleCloudStorageModule,
      providers: [
        {
          provide: GOOGLE_CLOUD_STORAGE_OPTIONS,
          useValue: options,
        },
        GoogleCloudStorageService,
      ],
      exports: [GoogleCloudStorageService],
    };
  }
}
