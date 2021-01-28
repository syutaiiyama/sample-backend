import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Connection, EntityManager, Repository } from 'typeorm';
import { LoggerService } from '../../../common/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly connection: Connection,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('PaymentService');
  }

  async createWithTransaction(
    createPaymentDto: CreatePaymentDto,
    manager: EntityManager,
  ) {
    this.loggerService.info('called createWithTransaction');
    const paymentRepository = manager.getRepository(Payment);
    const payment = await paymentRepository.create(createPaymentDto);
    const response = await paymentRepository.save(payment);
    return response;
  }

  findAll() {
    return `This action returns all payment`;
  }

  async findOne(orderId: string) {
    this.loggerService.info('called findOne');
    return this.paymentRepository.findOne({ orderId: orderId });
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
