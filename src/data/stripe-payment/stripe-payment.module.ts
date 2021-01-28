import { Module } from '@nestjs/common';
import { StripePaymentService } from './stripe-payment.service';
import { StripePaymentController } from './stripe-payment.controller';
import { StripeModule } from '../../infra/stripe/stripe.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [StripeModule, LoggerModule],
  controllers: [StripePaymentController],
  providers: [StripePaymentService],
})
export class StripePaymentModule {}
