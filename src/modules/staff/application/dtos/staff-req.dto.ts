import { employment_status, employment_type } from '@/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class StaffDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ enum: employment_type })
  @IsEnum(employment_type)
  @IsOptional()
  employmentType?: employment_type;

  @ApiPropertyOptional({ enum: employment_status })
  @IsEnum(employment_status)
  @IsOptional()
  employmentStatus?: employment_status;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  joinDate?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  citizenId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
