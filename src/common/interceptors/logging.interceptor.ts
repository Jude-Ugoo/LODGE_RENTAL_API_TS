import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const now = Date.now();

    this.logger.log(`${method} ${url} - incoming`);

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        const res = context.switchToHttp().getResponse();
        const status = res.statusCode;
        this.logger.log(`${method} ${url} ${status} - ${ms}ms`);
      }),
    );
  }
}
