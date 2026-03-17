import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = 'OK'): ApiResponseDto<T> {
    return new ApiResponseDto<T>(200, message, data);
  }

  static created<T>(data: T, message = 'Created'): ApiResponseDto<T> {
    return new ApiResponseDto<T>(201, message, data);
  }
}
