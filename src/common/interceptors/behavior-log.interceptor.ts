import { AllowBehaviorLog } from '@common/constants/allow-behavior-log';
import { BehaviorLogEntity } from '@common/entities';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Repository } from 'typeorm';

@Injectable()
export class BehaviorLogInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(BehaviorLogEntity)
    private readonly behaviorLogRepository: Repository<BehaviorLogEntity>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.originalUrl;
    const user = request.user || null;

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const allowLog = AllowBehaviorLog.find(
          (item) => url.includes(item.apiUrl) && item.method === method,
        );

        if (allowLog) {
          this.behaviorLogRepository
            .create({
              apiUrl: url,
              method: method,
              createdBy: user?.id || 0,
              status: statusCode,
              data: request.body || {},
            })
            .save();
        }
      }),
    );
  }
}
