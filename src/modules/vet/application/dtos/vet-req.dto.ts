import { employment_status } from '@/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class VetDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  licenseNo?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  licenseIssueBy?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  licenseValidFrom?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  licenseValidTo?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  joinDate?: Date;

  @ApiPropertyOptional({ nullable: true })
  @IsDateString()
  @IsOptional()
  endDate?: Date | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  citizenId?: string;

  @ApiPropertyOptional({ enum: employment_status })
  @IsEnum(employment_status)
  @IsOptional()
  employmentStatus?: employment_status;
}
