import { Injectable } from '@nestjs/common';
import { CreateProductImageRequest } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { LoggerService } from '../../../common/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './product-image.entity';
import { Connection, Repository } from 'typeorm';
import { StorageService } from '../../storage/storage.service';
import { CreateStorageRequest } from '../../storage/dto/create-storage.dto';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly storageService: StorageService,
    private readonly connection: Connection,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('ProductImageService');
  }

  async getStorageUrl(productImageId: string) {
    this.loggerService.info('called getStorageUrl');
    const response = await this.storageService.getStorageUrl(productImageId);
    return response;
  }

  async create(createProductImageRequest: CreateProductImageRequest) {
    this.loggerService.info('called create');
    console.log(createProductImageRequest);
    const response = await this.connection.transaction(async (manager) => {
      const productImageRepository = manager.getRepository(ProductImage);
      const productImage = await productImageRepository.create(
        createProductImageRequest,
      );
      const savedProductImage = await productImageRepository.save(productImage);

      const createStorageRequest: CreateStorageRequest = {
        storageRecordId: savedProductImage.id,
        fileName: createProductImageRequest.uploadedFileMetadata.originalname,
        contentType: createProductImageRequest.uploadedFileMetadata.mimetype,
        buffer: createProductImageRequest.uploadedFileMetadata.buffer,
      };
      const createProductImageResponse = {
        url: await this.storageService.createWithTransaction(
          createStorageRequest,
          manager,
        ),
      };
      return createProductImageResponse;
    });
    return response;
  }

  async remove(id: string) {
    this.loggerService.info('called remove');
    const response = await this.connection.transaction(async (manager) => {
      const productImageRepository = manager.getRepository(ProductImage);
      await productImageRepository.delete(id);
      const storage = await this.storageService.removeWithTransaction(
        id,
        manager,
      );
      return { fileName: storage.fileName };
    });
    return response;
  }
}
