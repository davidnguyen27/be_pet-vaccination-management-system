import { DataResponse } from '@/shared/application/response.dto';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, DataResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<DataResponse<T>> {
    return next.handle().pipe(
      map(data => {
        if (data instanceof DataResponse) {
          return data;
        }
        return DataResponse.of(data);
      }),
    );
  }
}
