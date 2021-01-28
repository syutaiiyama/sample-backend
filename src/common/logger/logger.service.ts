import { Injectable, Logger, Scope } from '@nestjs/common';
import { RequestIdService } from './request-id/request-id.service';

// NOTE: Scope.Transient => DI されるたびに別のインスタンスを生成
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context: string;

  constructor(
    private readonly nestLogger: Logger,
    private readonly requestIdService: RequestIdService,
  ) {}
  setContext(context: string) {
    this.context = context;
  }

  setRequestId(requestId: string) {
    this.requestIdService.set(requestId);
  }

  info(message: string, meta?: any) {
    this.nestLogger.log(
      `[${this.requestIdService.get()}] ${message}`,
      this.context,
    );
  }

  error(message: string, trace: string, meta?: any) {
    this.nestLogger.error(
      `[${this.requestIdService.get()}] ${message}`,
      trace,
      this.context,
    );
  }

  warn(message: string, meta?: any) {
    this.nestLogger.warn(
      `[${this.requestIdService.get()}] ${message}`,
      this.context,
    );
  }

  debug(message: string) {
    this.nestLogger.debug(
      `[${this.requestIdService.get()}] ${message}`,
      this.context,
    );
    // dna 側には出力しない
  }
}
