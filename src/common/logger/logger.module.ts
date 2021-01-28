import { Logger, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { RequestIdModule } from './request-id/request-id.module';

@Module({
  imports: [RequestIdModule],
  providers: [LoggerService, Logger],
  exports: [LoggerService],
})
export class LoggerModule {}
