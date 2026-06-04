import { VaccinePlanStatus } from '@/enums/vaccine';
import { BaseQueryDTO } from '@/shared/application/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class VaccinePlanQueryDto extends BaseQueryDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  petId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  vaccineId?: string;

  @ApiPropertyOptional({ enum: VaccinePlanStatus })
  @IsOptional()
  @IsEnum(VaccinePlanStatus)
  status?: VaccinePlanStatus;

  @ApiPropertyOptional({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueFrom?: Date;

  @ApiPropertyOptional({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueTo?: Date;
}
