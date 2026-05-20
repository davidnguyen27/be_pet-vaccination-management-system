import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDTO {
  @ApiPropertyOptional({ example: 'Nguyen Van A' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string | null;

  @ApiPropertyOptional({ example: '0123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phoneNumber?: string | null;

  @ApiPropertyOptional({ example: '1989-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date | null;
}
