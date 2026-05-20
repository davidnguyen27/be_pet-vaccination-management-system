import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

// ========== REQUEST DTOS ==========

export class RegisterDTO {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required!' })
  email!: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Password must contain uppercase, lowercase, digit and special character',
  })
  password!: string;

  @ApiPropertyOptional({ example: 'Nguyen Van A' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;
}

export class LoginDTO {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RefreshTokenDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'verification_token' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}

export class ResendEmailDTO {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required!' })
  email!: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required!' })
  email!: string;
}

export class ResetPasswordDTO {
  @ApiProperty({ example: 'reset_password_token' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ example: 'new password' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Password must contain uppercase, lowercase, digit and special character',
  })
  newPassword!: string;

  @ApiPropertyOptional({ example: 'new password' })
  @IsOptional()
  @IsString()
  @MaxLength(72)
  confirmPassword?: string;
}

export class ValidateTokenDTO {
  @ApiProperty({ example: 'reset_password_token' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}

// ========== RESPONSE DTOS ==========

export class AuthTokensResponseDTO {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;

  constructor(accessToken: string, refreshToken: string, accessExpiresAt: Date, refreshExpiresAt: Date) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessExpiresAt = accessExpiresAt;
    this.refreshExpiresAt = refreshExpiresAt;
  }
}

export interface MeResponse {
  id: string;
  email: string;
  isActive: boolean;
  isDeleted: boolean;
  roleId: string;
  fullName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  dob: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  lastLoginAt: string | null;
}
