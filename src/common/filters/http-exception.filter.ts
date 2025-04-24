import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from '../response/response';
import { ErrorCode, ErrorMessage } from '../constants/error-code';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // 处理业务异常
    if (exceptionResponse.code && typeof exceptionResponse.code === 'number') {
      response.status(status).json({
        code: exceptionResponse.code,
        message:
          exceptionResponse.message ||
          ErrorMessage[exceptionResponse.code] ||
          '未知错误',
        data: null,
      });
      return;
    }

    // 处理系统异常
    response
      .status(status)
      .json(
        Response.error(
          ErrorCode.SYSTEM_ERROR,
          exceptionResponse.message || ErrorMessage[ErrorCode.SYSTEM_ERROR],
        ),
      );
  }
}
