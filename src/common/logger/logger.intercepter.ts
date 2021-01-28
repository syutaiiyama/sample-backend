import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoggerService } from './logger.service';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ServerResponse } from 'http';

// NOTE: RequestId を作成し，Loggerにセットする
// NOTE: FrontEnd側でのエラーハンドリング時でもトラッキングできるようにするため，Response Header にも requestId を挿入する
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    if (process.env.NODE_ENV === 'test') return next.handle();
    try {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse<ServerResponse>();

      const requestId = uuidv4().toLowerCase().replace(/-/g, '');

      this.logger.setRequestId(requestId);
      this.logger.setContext('LoggerInterceptor');
      this.logger.info(`request ${request.method} ${request.url}`, {
        user: request.user,
        requestHeaders: request.headers,
        requestBody: request.body,
      });

      return next.handle().pipe(
        map((data) => {
          this.logger.info(`response ${request.method} ${request.url}`, {
            user: request.user,
            responseBody: data,
          });
          response.setHeader('x-request-id', requestId);
          return data;
        }),
      );
    } catch (error) {
      // e2e spec では request オブジェクトが不完全のため
      if (process.env.NODE_ENV !== 'test') {
        this.logger.warn('LoggerInterceptor error:', error);
      }
    }
  }
}
