import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateStorageRequest {
  @IsString()
  @IsNotEmpty()
  readonly fileName: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly storageRecordId: string;

  @IsString()
  @IsNotEmpty()
  readonly contentType: string;

  @IsNotEmpty()
  readonly buffer: Buffer;
}
