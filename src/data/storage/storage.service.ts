import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';
import { CreateStorageRequest } from './dto/create-storage.dto';
import { Storage } from './storage.entity';
import { GoogleCloudStorageService } from '../../infra/google-cloud-storage/google-cloud-storage.service';
import { UploadGoogleCloudStorageRequest } from '../../infra/google-cloud-storage/dto/upload-google-cloud-storage.dto';
import { STORAGE_OPTIONS } from './storage.constants';
import { StorageOptions } from './interface/storage.interface';
import { LoggerService } from '../../common/logger/logger.service';

// NOTE: ストレージのメタデータを管理する。optionでstorageRecordType(BannerImage)を指定することで、
// NOTE: storageRecordId(BannerImageIdなど)のみでGet/Deleteができる
@Injectable()
export class StorageService {
  constructor(
    private readonly googleCloudStorageService: GoogleCloudStorageService,
    @Inject(STORAGE_OPTIONS)
    private readonly options: StorageOptions,
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
    private readonly connection: Connection,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('StorageService');
  }

  // GET
  async findOne(storageRecordId: string): Promise<Storage> {
    this.logger.info('called findOne', { storageRecordId });
    const response = await this.storageRepository.findOne({
      storageRecordType: this.options.storageRecordType,
      storageRecordId: storageRecordId,
    });
    this.logger.info('end findOne', { response });
    return response;
  }

  async getStorageUrl(storageRecordId: string) {
    this.logger.info('called getStorageUrl', { storageRecordId });
    const storage = await this.findOne(storageRecordId);
    // このプロジェクトはデモなのでresponseは全て'image-url'にする
    // const response = await this.googleCloudStorageService.getStorageUrl(
    //   storage.key,
    // );
    const response = 'image-url';
    this.logger.info('end getStorageUrl', { response });
    return response;
  }

  // CREATE
  async create(createStorageRequest: CreateStorageRequest): Promise<string> {
    this.logger.info('called create', { createStorageRequest });
    const response = await this.connection.transaction(async (manager) => {
      return await this.createWithTransaction(createStorageRequest, manager);
    });
    this.logger.info('end create', { response });
    return response;
  }

  async createWithTransaction(
    createStorageRequest: CreateStorageRequest,
    manager: EntityManager,
  ): Promise<string> {
    this.logger.info('called createWithTransaction', { createStorageRequest });
    const storageRepository = manager.getRepository(Storage);
    const storage = await storageRepository.create({
      ...createStorageRequest,
      size: createStorageRequest.buffer.length.toString(),
      storageRecordType: this.options.storageRecordType,
    });
    const savedStorage = await storageRepository.save(storage);

    const uploadGoogleCloudStorageRequest: UploadGoogleCloudStorageRequest = {
      key: savedStorage.key,
      contentType: createStorageRequest.contentType,
      buffer: createStorageRequest.buffer,
    };

    // 最後にGoogle Cloud Storageにupload
    // このプロジェクトはデモなのでアップロードしない
    // const response = await this.googleCloudStorageService.upload(
    //   uploadGoogleCloudStorageRequest,
    // );
    const response = 'image-url';
    this.logger.info('end createWithTransaction', { response });
    return response;
  }

  // DELETE
  async remove(storageRecordId: string): Promise<Storage> {
    this.logger.info('called remove', { storageRecordId });
    const response = await this.connection.transaction(async (manager) => {
      return await this.removeWithTransaction(storageRecordId, manager);
    });
    this.logger.info('end remove', { Storage });
    return response;
  }

  async removeWithTransaction(
    storageRecordId: string,
    manager: EntityManager,
  ): Promise<Storage> {
    this.logger.info('called removeWithTransaction', { storageRecordId });
    // TODO: error handling
    const storage = await this.findOne(storageRecordId);
    if (storage === undefined) {
      // TODO: Error Handling
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Missing storage(recordType: ${this.options.storageRecordType}, recordId: ${storageRecordId}).`,
        },
        404,
      );
    }
    const storageRepository = manager.getRepository(Storage);
    await storageRepository.delete(storage.id);

    // 最後にGoogle Cloud Storageからdelete
    // await this.googleCloudStorageService.delete(storage.key);
    this.logger.info('end removeWithTransaction', { response: storage });
    return storage;
  }
}
