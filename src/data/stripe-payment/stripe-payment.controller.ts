import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { StripePaymentService } from './stripe-payment.service';
import { AuthGuard } from '@nestjs/passport';
import { LoggerInterceptor } from '../../common/logger/logger.intercepter';

@Controller('stripe-payment')
@UseGuards(AuthGuard('shop-user'))
@UseInterceptors(LoggerInterceptor)
export class StripePaymentController {
  constructor(private readonly stripePaymentService: StripePaymentService) {}

  @Get('/setup-intent')
  async getSetupIntent(@Request() request) {
    return await this.stripePaymentService.getSetupIntent(request.user);
  }
}
