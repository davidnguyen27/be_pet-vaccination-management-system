import { RoleCode } from '@/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Password must contain uppercase, lowercase, digit and special character',
  })
  password!: string;

  @ApiProperty({ enum: RoleCode, example: RoleCode.STAFF })
  @IsEnum(RoleCode, { message: 'Invalid role code' })
  @IsNotEmpty({ message: 'Role is required' })
  roleCode!: RoleCode;

  @ApiPropertyOptional({ example: 'Nguyen Van A' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName!: string;

  @ApiPropertyOptional({ example: '0123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phoneNumber!: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatarUrl!: string;

  @ApiPropertyOptional({ example: '1989-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob!: Date;
}
