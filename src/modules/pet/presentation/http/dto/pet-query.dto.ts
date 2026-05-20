import { Species } from '@/enums/species';
import { BaseQueryDTO } from '@/shared/application/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PetQueryDTO extends BaseQueryDTO {
  @ApiPropertyOptional({ enum: Species })
  @IsOptional()
  species?: Species;
}
