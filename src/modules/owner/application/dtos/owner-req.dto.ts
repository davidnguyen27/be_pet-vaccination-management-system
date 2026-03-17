import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class OwnerDto {
  @ApiPropertyOptional({ example: '123 Nguyen Trai, District 1' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ example: 10.7769 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  locationLat?: number;

  @ApiPropertyOptional({ example: 106.7009 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  locationLng?: number;
}
