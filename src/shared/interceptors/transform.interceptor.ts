import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../application/response.dto';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T | ApiResponseDto<T>, ApiResponseDto<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponseDto<T>> {
    const customMessage = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const httpResponse = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map(data => {
        // If the handler already returns an ApiResponseDto, pass through
        if (data !== null && typeof data === 'object' && 'statusCode' in data && 'success' in data) {
          return data as unknown as ApiResponseDto<T>;
        }
        return new ApiResponseDto<T>(httpResponse.statusCode, customMessage ?? 'Request successful.', data);
      }),
    );
  }
}
