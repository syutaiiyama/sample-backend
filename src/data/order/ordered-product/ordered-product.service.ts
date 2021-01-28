import { Injectable } from '@nestjs/common';
import { CreateOrderedProductDto } from './dto/create-ordered-product.dto';
import { UpdateOrderedProductDto } from './dto/update-ordered-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderedProduct } from './ordered-product.entity';
import { Connection, EntityManager, Repository } from 'typeorm';
import { LoggerService } from '../../../common/logger/logger.service';

@Injectable()
export class OrderedProductService {
  constructor(
    @InjectRepository(OrderedProduct)
    private readonly orderedProductRepository: Repository<OrderedProduct>,
    private readonly connection: Connection,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('OrderedProductService');
  }

  async createWithTransaction(
    createOrderedProductDto: CreateOrderedProductDto,
    manager: EntityManager,
  ) {
    this.loggerService.info('called createWithTransaction');
    const orderedProductRepository = manager.getRepository(OrderedProduct);
    const orderedProduct = await orderedProductRepository.create(
      createOrderedProductDto,
    );
    const response = await orderedProductRepository.save(orderedProduct);
    return response;
  }

  findAll() {
    return `This action returns all orderedProduct`;
  }

  async findManyByOrderId(orderId: string) {
    this.loggerService.info('called findOne');
    return await this.orderedProductRepository.find({ orderId: orderId });
  }

  update(id: number, updateOrderedProductDto: UpdateOrderedProductDto) {
    return `This action updates a #${id} orderedProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderedProduct`;
  }
}
