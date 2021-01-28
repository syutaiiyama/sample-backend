import { IsNotEmpty, IsString } from 'class-validator';
import { UploadedFileMetadata } from '../../../storage/interface/storage.interface';

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}

export class CreateProductImageRequest {
  productId: string;
  uploadedFileMetadata: UploadedFileMetadata;
}
