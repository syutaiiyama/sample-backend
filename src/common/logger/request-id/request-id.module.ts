import { Module } from '@nestjs/common';
import { RequestIdService } from './request-id.service';

@Module({
  providers: [RequestIdService],
  exports: [RequestIdService],
})
export class RequestIdModule {}
