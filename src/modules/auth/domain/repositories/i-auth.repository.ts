import { OtpType } from '../../../../../generated/prisma/enums';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  roleCode: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface CreateOtpData {
  userId: string;
  type: OtpType;
  otpHash: string;
  otpSalt?: string;
  expiresAt: Date;
}

export interface SaveRefreshTokenData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  replacedByTokenId?: string;
}

export interface IAuthRepository {
  /** User */
  findUserByEmail(email: string): Promise<import('../entities/user.entity').UserEntity | null>;
  findUserById(userId: string): Promise<import('../entities/user.entity').UserEntity | null>;
  createUser(data: CreateUserData): Promise<import('../entities/user.entity').UserEntity>;
  activateUser(userId: string): Promise<void>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  updateLastLogin(userId: string): Promise<void>;

  /** OTP */
  createOtp(data: CreateOtpData): Promise<{ otpCodeId: string }>;
  findValidOtp(
    userId: string,
    type: OtpType,
  ): Promise<{
    otpCodeId: string;
    otpHash: string;
    resendCount: number;
    expiresAt: Date;
    verifiedAt: Date | null;
  } | null>;
  markOtpVerified(otpCodeId: string): Promise<void>;
  incrementOtpResend(otpCodeId: string): Promise<void>;
  invalidatePreviousOtps(userId: string, type: OtpType): Promise<void>;

  /** Refresh token */
  saveRefreshToken(data: SaveRefreshTokenData): Promise<{ tokenId: string }>;
  findRefreshToken(tokenHash: string): Promise<{
    tokenId: string;
    userId: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null>;
  revokeRefreshToken(tokenId: string, replacedByTokenId?: string): Promise<void>;
  revokeAllUserRefreshTokens(userId: string): Promise<void>;
}

export const I_AUTH_REPOSITORY = Symbol('IAuthRepository');
