import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import {
  CreateProductImageDto,
  CreateProductImageRequest,
} from './dto/create-product-image.dto';
import { LoggerInterceptor } from '../../../common/logger/logger.intercepter';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product-image')
@UseInterceptors(LoggerInterceptor)
@UseGuards(AuthGuard('admin-user'))
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file,
    @Body() createProductImageDto: CreateProductImageDto,
  ) {
    const request: CreateProductImageRequest = {
      productId: createProductImageDto.productId,
      uploadedFileMetadata: file,
    };
    return this.productImageService.create(request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productImageService.remove(id);
  }
}
