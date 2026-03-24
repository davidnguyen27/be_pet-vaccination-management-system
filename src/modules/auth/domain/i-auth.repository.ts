export interface CreateUserData {
  email: string;
  passwordHash: string;
  roleCode: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface CreateVerifyTokenData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  redirectUrl?: string;
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

  /** Verification email */
  createVerifyToken(data: CreateVerifyTokenData): Promise<void>;
  findValidVerifyTokenByHash(tokenHash: string): Promise<{
    id: string;
    userId: string;
    redirectUrl?: string | null;
    expiresAt: Date;
    usedAt: Date | null;
  } | null>;
  markVerifyTokenUsed(id: string): Promise<void>;
  invalidatePreviousVerifyTokens(userId: string): Promise<void>;

  /** Refresh token */
  saveRefreshToken(data: SaveRefreshTokenData): Promise<{ tokenId: string }>;
  findRefreshToken(tokenId: string): Promise<{
    tokenId: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null>;
  revokeRefreshToken(tokenId: string, userId: string, replacedByTokenId?: string): Promise<number>;
  revokeAllUserRefreshTokens(userId: string): Promise<void>;
}

export const I_AUTH_REPOSITORY = Symbol('IAuthRepository');
