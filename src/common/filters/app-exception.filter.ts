import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { AppException } from '../exceptions';
import { Response } from 'express';
import { MakeResponse } from '../utils/response';

@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: AppException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json(MakeResponse.error(exception.code, exception.message));
  }
}

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(500).json(MakeResponse.error(1000, exception.message));
  }
}
