import { DomainException } from '@/shared/domain/domain.exception';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  success: false;
  statusCode: number;
  errorCode: string;
  message: string;
  path: string;
  timestamp: string;
}

type HttpExceptionResponseBody = {
  message?: string | string[];
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let errorCode: string;
    let message: string;

    if (exception instanceof DomainException) {
      statusCode = exception.statusCode;
      errorCode = exception.errorCode;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      errorCode = 'HTTP_EXCEPTION';
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const responseBody = exceptionResponse as HttpExceptionResponseBody;
        const responseMessage = responseBody.message;
        message = Array.isArray(responseMessage) ? responseMessage.join('; ') : (responseMessage ?? exception.message);
      }
    } else {
      this.logger.error('Unexpected error', exception);
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = 'INTERNAL_SERVER_ERROR';
      message = 'Something went wrong';
    }

    const body: ErrorResponse = {
      success: false,
      statusCode,
      errorCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }
}
