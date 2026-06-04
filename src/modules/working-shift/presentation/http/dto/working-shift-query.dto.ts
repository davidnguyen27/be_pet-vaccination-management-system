import { BaseQueryDTO } from '@/shared/application/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Weekday } from '../../../domain/working-shift.types';

export class WorkingShiftQueryDto extends BaseQueryDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  vetId?: string;

  @ApiPropertyOptional({ enum: Weekday })
  @IsOptional()
  @IsEnum(Weekday)
  dayOfWeek?: Weekday;
}
