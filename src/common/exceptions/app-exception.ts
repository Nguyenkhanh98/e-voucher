import { HttpException } from '@nestjs/common';
import { IAppError } from './app-error.interface';

export class AppException extends HttpException {
  constructor(appError: IAppError, extraData: object = undefined) {
    super(
      {
        message: appError.errorMessage,
        errorCode: appError.errorCode,
        details: extraData,
      },
      appError.statusCode,
    );
  }
}
