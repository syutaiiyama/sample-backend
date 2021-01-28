import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { StripeModule } from '../../../infra/stripe/stripe.module';
import { LoggerModule } from '../../../common/logger/logger.module';

@Module({
  imports: [StripeModule, LoggerModule],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
