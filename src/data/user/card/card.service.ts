import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../common/logger/logger.service';
import { StripeService } from '../../../infra/stripe/stripe.service';

@Injectable()
export class CardService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly stripeService: StripeService,
  ) {
    this.loggerService.setContext('CardService');
  }

  async getCards(stripeCustomerId: string) {
    const stripePaymentList = await this.stripeService.getPaymentMethods(
      stripeCustomerId,
    );
    let cardData;
    if (stripePaymentList.length > 0) {
      cardData = stripePaymentList.map((payment) => {
        return {
          brand: payment.card.brand,
          last4: payment.card.last4,
          expYear: payment.card.exp_year,
          expMonth: payment.card.exp_month,
        };
      });
    } else {
      cardData = [];
    }
    return cardData;
  }
}
