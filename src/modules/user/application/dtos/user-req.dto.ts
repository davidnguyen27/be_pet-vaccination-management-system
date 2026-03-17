import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { employment_status, employment_type } from '../../../../../generated/prisma/enums';
import { RoleCode } from '@/enums';

export class StaffProfileDto {
  @ApiProperty({ example: 'STAFF001' })
  @IsString()
  @IsNotEmpty({ message: 'Staff code is required!' })
  code!: string;

  @ApiPropertyOptional({ example: 'Receptionist' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  jobTitle?: string;

  @ApiPropertyOptional({ example: 'Front Office' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @ApiPropertyOptional({ enum: employment_type, example: employment_type.FULL_TIME })
  @IsOptional()
  @IsEnum(employment_type)
  employmentType?: employment_type;

  @ApiPropertyOptional({ enum: employment_status, example: employment_status.WORKING })
  @IsOptional()
  @IsEnum(employment_status)
  employmentStatus?: employment_status;

  @ApiProperty({ example: '2026-03-16' })
  @Type(() => Date)
  @IsDate()
  joinDate!: Date;

  @ApiPropertyOptional({ example: '2027-03-16' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({ example: '123 Nguyen Trai, District 1' })
  @IsString()
  @IsNotEmpty({ message: 'Address is required!' })
  @MaxLength(255)
  address!: string;

  @ApiProperty({ example: '079123456789' })
  @IsString()
  @IsNotEmpty({ message: 'Citizen ID is required!' })
  @MaxLength(30)
  citizenId!: string;

  @ApiPropertyOptional({ example: 'Works morning shift' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}

export class UserDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format!' })
  @IsNotEmpty({ message: 'Email is required!' })
  email!: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long!' })
  @MaxLength(72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Password must contain uppercase, lowercase, digit and special character',
  })
  password!: string;

  @ApiProperty({ enum: RoleCode, example: RoleCode.STAFF, description: 'Role assigned to the new user' })
  @IsEnum(RoleCode, { message: 'Invalid role code' })
  @IsNotEmpty({ message: 'Role is required!' })
  roleCode!: RoleCode;

  @ApiPropertyOptional({ example: 'Nguyen Van A' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @ApiPropertyOptional({ example: '0123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '1989-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date;

  @ApiPropertyOptional({ type: () => StaffProfileDto })
  @ValidateIf(dto => dto.roleCode === RoleCode.STAFF)
  @IsDefined({ message: 'staffProfile is required when roleCode is STAFF' })
  @ValidateNested()
  @Type(() => StaffProfileDto)
  staffProfile?: StaffProfileDto;
}
