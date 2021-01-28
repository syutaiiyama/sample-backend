import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Connection, Repository } from 'typeorm';
import { LoggerService } from '../../common/logger/logger.service';
import { GetProductDto } from './dto/get-product.dto';
import { ProductImageService } from './product-image/product-image.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly connection: Connection,
    private readonly loggerService: LoggerService,
    private readonly productImageService: ProductImageService,
  ) {
    this.loggerService.setContext('ProductService');
  }

  async create(createProductDto: CreateProductDto) {
    this.loggerService.info('called create');
    const response = this.connection.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);
      const product = await productRepository.create(createProductDto);
      return await productRepository.save(product);
    });
    return response;
  }

  async findAll() {
    this.loggerService.info('called findAll');
    const foundProducts = await this.productRepository.find({
      relations: ['productImage'],
    });
    const products = foundProducts === undefined ? [] : foundProducts;
    const response = await Promise.all(
      products.map(async (product) => {
        const productData: GetProductDto = {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          imageUrl: product.productImage
            ? await this.productImageService.getStorageUrl(
                product.productImage.id,
              )
            : undefined,
        };
        return productData;
      }),
    );
    return response;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    this.loggerService.info('called update');
    const product = await this.productRepository.findOne(id);
    if (product === undefined) {
      this.loggerService.info('nothing product');
      return;
    }
    Object.assign(product, updateProductDto);
    const response = await this.connection.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);
      return await productRepository.save(product);
    });
    return response;
  }

  async remove(id: string) {
    this.loggerService.info('called remove');
    await this.connection.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);
      return await productRepository.delete(id);
    });
  }
}
