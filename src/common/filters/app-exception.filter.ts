import { Catch, ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { AppException } from '../exceptions';
import { Response } from 'express';
import { MakeResponse } from '../utils/response';

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: AppException, host: ArgumentsHost) {
    this.logger.error(exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json(MakeResponse.error(exception.code, exception.message));
  }
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    this.logger.error(exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(500).json(MakeResponse.error(1000, exception.message));
  }
}
