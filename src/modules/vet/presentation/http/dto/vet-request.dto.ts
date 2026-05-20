import { EmploymentStatus } from '@/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class VetDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  licenseNo!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  licenseIssueBy!: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  licenseValidFrom!: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  licenseValidTo!: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  joinDate!: string;

  @ApiPropertyOptional({ nullable: true })
  @IsDateString()
  @IsOptional()
  endDate?: string | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  citizenId!: string;

  @ApiPropertyOptional({ enum: EmploymentStatus })
  @IsEnum(EmploymentStatus)
  @IsOptional()
  employmentStatus?: EmploymentStatus;
}
