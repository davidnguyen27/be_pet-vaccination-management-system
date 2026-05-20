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

export abstract class AuthRepositoryPort {
  /** User */
  abstract activateUser(userId: string): Promise<void>;
  abstract changePassword(userId: string, passwordHash: string): Promise<void>;
  abstract updateLastLogin(userId: string): Promise<void>;

  /** Verification email */
  abstract createVerifyToken(data: CreateVerifyTokenData): Promise<void>;
  abstract findValidVerifyTokenByHash(tokenHash: string): Promise<{
    id: string;
    userId: string;
    redirectUrl?: string | null;
    expiresAt: Date;
    usedAt: Date | null;
  } | null>;
  abstract markVerifyTokenUsed(id: string): Promise<void>;
  abstract invalidatePreviousVerifyTokens(userId: string): Promise<void>;

  /** Refresh token */
  abstract saveRefreshToken(data: SaveRefreshTokenData): Promise<{ tokenId: string }>;
  abstract findRefreshToken(tokenId: string): Promise<{
    tokenId: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null>;
  abstract revokeRefreshToken(tokenId: string, userId: string, replacedByTokenId?: string): Promise<number>;
  abstract revokeAllUserRefreshTokens(userId: string): Promise<void>;
}

export const AUTH_REPOSITORY_PORT = Symbol('AuthRepositoryPort');
