import { VaccineLotStatus } from '@/enums/vaccine';
import { BaseQueryDTO } from '@/shared/application/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class VaccineLotQueryDto extends BaseQueryDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  vaccineId?: string;

  @ApiPropertyOptional({ enum: VaccineLotStatus })
  @IsOptional()
  @IsEnum(VaccineLotStatus)
  status?: VaccineLotStatus;
}
