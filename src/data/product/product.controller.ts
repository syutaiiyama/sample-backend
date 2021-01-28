import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoggerInterceptor } from '../../common/logger/logger.intercepter';

@Controller('product')
@UseInterceptors(LoggerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('admin-user'))
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin-user'))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-user'))
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
