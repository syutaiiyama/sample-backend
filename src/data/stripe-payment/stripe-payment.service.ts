import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { StripeService } from '../../infra/stripe/stripe.service';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class StripePaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('StripePaymentService');
  }

  async getSetupIntent(user: User) {
    this.loggerService.info('called getSetupIntent');
    return await this.stripeService.createSetupIntent(user.stripeCustomerId);
  }
}
