import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UploadGoogleCloudStorageRequest {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty({ type: String, description: 'GCS保存用ファイル名' })
  key: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'content type' })
  contentType: string;

  @IsNotEmpty()
  @ApiProperty({ type: Buffer, description: 'ファイルデータ' })
  buffer: Buffer;
}
