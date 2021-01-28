import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { CardService } from './card.service';
import { LoggerInterceptor } from '../../../common/logger/logger.intercepter';
import { AuthGuard } from '@nestjs/passport';

@Controller('card')
@UseInterceptors(LoggerInterceptor)
@UseGuards(AuthGuard('shop-user'))
export class CardController {
  constructor(private readonly cardService: CardService) {}
}
