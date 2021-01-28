// NOTE: DynamicModule生成時に渡すオプション
export interface GoogleCloudStorageOptions {
  // NOTE: 使用するバケット名
  useBucketName: string;
  // NOTE: urlの有効期限（分）デフォルトでは30分
  urlExpiresMinutes?: number;
}
