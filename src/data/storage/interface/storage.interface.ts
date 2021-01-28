import { GoogleCloudStorageOptions } from '../../../infra/google-cloud-storage/interface/google-cloud-storage-options.interface';

export type StorageRecordType = 'ProductImage';

// NOTE: DynamicModule生成時に渡すオプション
export class StorageOptions {
  // NOTE: ストレージのType
  storageRecordType: StorageRecordType;
  // NOTE: GCSストレージ用のOption
  googleCloudStorageOptions: GoogleCloudStorageOptions;
}

// NOTE: Multerのパース後のメタデータを取得するためのクラス
// NOTE: 参考：https://developer.aliyun.com/mirror/npm/package/multer
export class UploadedFileMetadata {
  // NOTE: form-dataのKeyの文字列
  fieldname: string;

  // NOTE: ファイル名
  originalname: string;

  // NOTE: 文字エンコード
  encoding: string;

  // NOTE: MIMEタイプ
  mimetype: string;

  // NOTE: ファイルデータ
  buffer: Buffer;

  // NOTE: ファイルサイズ
  size?: string;
}
