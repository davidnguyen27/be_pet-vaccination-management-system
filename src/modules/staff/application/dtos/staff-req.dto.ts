import { employment_status, employment_type } from '@/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class StaffDto {
  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ enum: employment_type })
  @IsEnum(employment_type)
  employmentType!: 'FULL_TIME';

  @ApiProperty({ enum: employment_status })
  @IsEnum(employment_status)
  employmentStatus!: 'WORKING';

  @ApiProperty()
  @IsDateString()
  joinDate!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty()
  @IsString()
  address!: string;

  @ApiProperty()
  @IsString()
  citizenId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
