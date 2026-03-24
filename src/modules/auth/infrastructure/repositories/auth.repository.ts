import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { IAuthRepository, SaveRefreshTokenData, CreateVerifyTokenData } from '../../domain/i-auth.repository';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get now(): Date {
    return new Date();
  }

  // user
  async activateUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });
  }

  async changePassword(userId: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  async createVerifyToken(data: CreateVerifyTokenData): Promise<void> {
    await this.prisma.verifyToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        redirectUrl: data.redirectUrl,
        expiresAt: data.expiresAt,
        sentCount: 1,
        lastSentAt: this.now,
      },
    });
  }

  async findValidVerifyTokenByHash(tokenHash: string): Promise<{
    id: string;
    userId: string;
    redirectUrl?: string | null;
    expiresAt: Date;
    usedAt: Date | null;
  } | null> {
    return await this.prisma.verifyToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        redirectUrl: true,
        expiresAt: true,
        usedAt: true,
      },
    });
  }

  async markVerifyTokenUsed(id: string): Promise<void> {
    await this.prisma.verifyToken.update({
      where: { id },
      data: { usedAt: this.now },
    });
  }

  async invalidatePreviousVerifyTokens(userId: string): Promise<void> {
    await this.prisma.verifyToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: { usedAt: this.now },
    });
  }

  // Refresh token
  async saveRefreshToken(data: SaveRefreshTokenData): Promise<{ tokenId: string }> {
    const record = await this.prisma.refreshToken.create({
      data: {
        ...(data.tokenId ? { id: data.tokenId } : {}),
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        replacedByTokenId: data.replacedByTokenId,
      },
    });
    return { tokenId: record.id };
  }

  async findRefreshToken(tokenId: string): Promise<{
    tokenId: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null> {
    const record = await this.prisma.refreshToken.findUnique({
      where: { id: tokenId },
      select: {
        id: true,
        userId: true,
        tokenHash: true,
        expiresAt: true,
        revokedAt: true,
      },
    });

    if (!record) return null;

    return {
      tokenId: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      expiresAt: record.expiresAt,
      revokedAt: record.revokedAt,
    };
  }

  async revokeRefreshToken(tokenId: string, userId: string, replacedByTokenId?: string): Promise<number> {
    const result = await this.prisma.refreshToken.updateMany({
      where: { id: tokenId, userId, revokedAt: null },
      data: {
        revokedAt: new Date(),
        ...(replacedByTokenId ? { replacedByTokenId } : {}),
      },
    });
    return result.count;
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
