import { OtpType } from '@/enums';

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
  expiresAt: Date;
}

export interface SaveRefreshTokenData {
  tokenId?: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  replacedByTokenId?: string;
}

export interface IAuthRepository {
  /** User */
  activateUser(userId: string): Promise<void>;
  changePassword(userId: string, passwordHash: string): Promise<void>;
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
  findRefreshToken(tokenId: string): Promise<{
    tokenId: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null>;
  revokeRefreshToken(tokenId: string, replacedByTokenId?: string): Promise<void>;
  revokeAllUserRefreshTokens(userId: string): Promise<void>;
}

export const I_AUTH_REPOSITORY = Symbol('IAuthRepository');
