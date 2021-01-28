import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FirebaseModule } from '../../infra/firebase/firebase.module';
import { LoggerModule } from '../../common/logger/logger.module';
import { StripeModule } from '../../infra/stripe/stripe.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    FirebaseModule,
    LoggerModule,
    StripeModule,
    CardModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
