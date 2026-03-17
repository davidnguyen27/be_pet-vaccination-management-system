import { employment_status } from '@/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class VetDto {
  @ApiProperty()
  @IsString()
  bio!: string;

  @ApiProperty()
  @IsString()
  licenseNo!: string;

  @ApiProperty()
  @IsString()
  licenseIssueBy!: string;

  @ApiProperty()
  @IsDateString()
  licenseValidFrom!: Date;

  @ApiProperty()
  @IsDateString()
  licenseValidTo!: Date;

  @ApiProperty()
  @IsDateString()
  joinDate!: Date;

  @ApiProperty()
  @IsDateString()
  endDate!: Date | null;

  @ApiProperty()
  @IsString()
  address!: string;

  @ApiProperty()
  @IsString()
  citizenId!: string;

  @ApiProperty()
  @IsString()
  employmentStatus!: employment_status;
}
