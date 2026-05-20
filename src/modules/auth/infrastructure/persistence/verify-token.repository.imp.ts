import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { VerifyTokenRepositoryPort } from '../../application/ports/verify-token.repository.port';
import { VerifyTokenEntity, VerifyTokenType } from '../../domain/verify-token.entity';

@Injectable()
export class VerifyTokenRepositoryImpl implements VerifyTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toTokenHash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private toRedirectUrl(type: VerifyTokenType): string {
    return type === 'EMAIL_VERIFICATION'
      ? AUTH_CONSTANTS.TOKEN_PURPOSE.VERIFY_EMAIL
      : AUTH_CONSTANTS.TOKEN_PURPOSE.RESET_PASSWORD;
  }

  private toVerifyType(redirectUrl?: string | null): VerifyTokenType {
    if (redirectUrl === AUTH_CONSTANTS.TOKEN_PURPOSE.VERIFY_EMAIL) {
      return 'EMAIL_VERIFICATION';
    }
    return 'PASSWORD_RESET';
  }

  async save(token: VerifyTokenEntity): Promise<void> {
    const tokenHash = this.toTokenHash(token.token);

    await this.prisma.verifyToken.upsert({
      where: { id: token.id },
      create: {
        id: token.id,
        userId: token.userId,
        tokenHash,
        redirectUrl: this.toRedirectUrl(token.type),
        expiresAt: token.expiresAt,
        usedAt: token.usedAt,
        sentCount: 1,
        lastSentAt: new Date(),
        createdAt: token.createdAt,
      },
      update: {
        tokenHash,
        redirectUrl: this.toRedirectUrl(token.type),
        expiresAt: token.expiresAt,
        usedAt: token.usedAt,
      },
    });
  }

  async findByToken(token: string): Promise<VerifyTokenEntity | null> {
    const tokenHash = this.toTokenHash(token);
    const raw = await this.prisma.verifyToken.findUnique({
      where: { tokenHash },
    });

    if (!raw) return null;

    return VerifyTokenEntity.reconstitute(raw.id, {
      userId: raw.userId,
      token,
      type: this.toVerifyType(raw.redirectUrl),
      expiresAt: raw.expiresAt,
      usedAt: raw.usedAt,
      createdAt: raw.createdAt,
    });
  }

  async deleteByUserIdAndType(userId: string, type: VerifyTokenType): Promise<void> {
    await this.prisma.verifyToken.deleteMany({
      where: {
        userId,
        redirectUrl: this.toRedirectUrl(type),
      },
    });
  }
}
