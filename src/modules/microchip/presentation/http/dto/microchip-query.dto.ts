import { MicrochipStatus } from '@/enums/microchip';
import { BaseQueryDTO } from '@/shared/application/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class MicrochipQueryDto extends BaseQueryDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  batchId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  petId?: string;

  @ApiPropertyOptional({ enum: MicrochipStatus })
  @IsOptional()
  @IsEnum(MicrochipStatus)
  status?: MicrochipStatus;
}
