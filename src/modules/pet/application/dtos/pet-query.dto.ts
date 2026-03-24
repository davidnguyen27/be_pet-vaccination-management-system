import { Species } from '@/enums/species';
import { BaseQueryDto } from '@/shared/application/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PetQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: Species })
  @IsOptional()
  species?: Species;
}
