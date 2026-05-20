import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { RefreshTokenRepositoryPort } from '../../application/ports/refresh-token.repository.port';
import { RefreshTokenEntity } from '../../domain/refresh-token.entity';

@Injectable()
export class RefreshTokenRepositoryImpl implements RefreshTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toTokenHash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async save(entity: RefreshTokenEntity): Promise<void> {
    const tokenHash = this.toTokenHash(entity.token);

    await this.prisma.refreshToken.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        userId: entity.userId,
        tokenHash,
        expiresAt: entity.expiresAt,
        revokedAt: entity.revokedAt,
        createdAt: entity.createdAt,
      },
      update: {
        tokenHash,
        expiresAt: entity.expiresAt,
        revokedAt: entity.revokedAt,
      },
    });
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    const tokenHash = this.toTokenHash(token);
    const raw = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!raw) return null;

    return RefreshTokenEntity.reconstitute(raw.id, {
      userId: raw.userId,
      token,
      expiresAt: raw.expiresAt,
      revokedAt: raw.revokedAt,
      createdAt: raw.createdAt,
    });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
