import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { LoggerModule } from '../../../common/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), LoggerModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
