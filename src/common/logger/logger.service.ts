import { Injectable, LoggerService } from '@nestjs/common';
import { Logger, createLogger, transports } from 'winston';

@Injectable()
export class AppLogger implements LoggerService {
  private context?: string;
  private winstonLogger: Logger;

  public setContext(context: string) {
    this.context = context;
  }

  constructor() {
    this.winstonLogger = createLogger({
      transports: [new transports.Console()],
    });
    this.context = 'APP';
  }

  log(message: any, context?: string) {
    return this.winstonLogger.info(message, {
      context: context || this.context,
    });
  }

  error(message: any, trace?: string, context?: string): any {
    return this.winstonLogger.error(message, {
      trace,
      context: context || this.context,
    });
  }

  warn(message: any, context?: string): any {
    return this.winstonLogger.warn(message, {
      context: context || this.context,
    });
  }

  debug(message: any, context?: string): any {
    return this.winstonLogger.debug(message, {
      context: context || this.context,
    });
  }

  verbose(message: any, context?: string): any {
    return this.winstonLogger.verbose(message, {
      context: context || this.context,
    });
  }
}
