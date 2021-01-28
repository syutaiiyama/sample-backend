import { Inject, Injectable } from '@nestjs/common';
import { Storage, Bucket } from '@google-cloud/storage';
import { UploadGoogleCloudStorageRequest } from './dto/upload-google-cloud-storage.dto';
import { GOOGLE_CLOUD_STORAGE_OPTIONS } from './google-cloud-storage.constant';
import { GoogleCloudStorageOptions } from './interface/google-cloud-storage-options.interface';

@Injectable()
export class GoogleCloudStorageService {
  // urlの有効期限
  private readonly urlExpiresMinutes: number = 30;
  private readonly storage: Storage = null;
  private readonly bucket: Bucket = null;
  private readonly bucketName = null;
  private readonly isTest: boolean = false;
  constructor(
    @Inject(GOOGLE_CLOUD_STORAGE_OPTIONS)
    private options: GoogleCloudStorageOptions,
  ) {
    this.storage = new Storage({
      projectId: process.env.NEST_APP_GOOGLE_CLOUD_STORAGE_PROJECT_ID,
      credentials: {
        client_email: process.env.NEST_APP_GOOGLE_CLOUD_STORAGE_CLIENT_EMAIL,
        private_key: process.env.NEST_APP_GOOGLE_CLOUD_STORAGE_PRIVATE_KEY.replace(
          /\\n/g,
          '\n',
        ),
      },
    });
    this.bucketName = options.useBucketName;
    this.bucket = this.storage.bucket(this.bucketName);
    this.urlExpiresMinutes =
      options.urlExpiresMinutes === undefined
        ? this.urlExpiresMinutes
        : options.urlExpiresMinutes;
    this.isTest = process.env.NODE_ENV === 'test';
  }

  async upload(
    uploadGoogleCloudStorageRequest: UploadGoogleCloudStorageRequest,
  ) {
    if (this.isTest) return;
    // GCSにuploadする段階で失敗したら正しくロールバックするように最後にgcsを更新する
    const file = this.bucket.file(uploadGoogleCloudStorageRequest.key);
    return new Promise<string>((resolve, reject) =>
      file
        .createWriteStream({
          contentType: uploadGoogleCloudStorageRequest.contentType,
        })
        .on('error', (error) => reject(error))
        .on('finish', async () =>
          resolve(
            await this.getStorageUrl(uploadGoogleCloudStorageRequest.key),
          ),
        )
        .end(uploadGoogleCloudStorageRequest.buffer),
    );
  }

  async delete(key: string) {
    if (this.isTest) return;
    // TODO: error handling
    await this.bucket.deleteFiles({ prefix: key });
  }

  async getStorageUrl(key: string) {
    const file = this.bucket.file(key);
    const response = await file.getSignedUrl({
      action: 'read',
      // URLの有効期限をミリ秒で指定
      expires: Date.now() + 1000 * 60 * this.urlExpiresMinutes,
    });

    return response[0];
  }
}
