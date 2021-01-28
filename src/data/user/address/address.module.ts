import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { AddressController } from './address.controller';
import { AuthModule } from '../../../common/auth/auth.module';
import { LoggerModule } from '../../../common/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), AuthModule, LoggerModule],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
