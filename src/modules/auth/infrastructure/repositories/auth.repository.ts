import { Injectable } from '@nestjs/common';
import { OtpType, RoleCode } from '../../../../../generated/prisma/enums';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import {
  CreateOtpData,
  CreateUserData,
  IAuthRepository,
  SaveRefreshTokenData,
} from '../../domain/repositories/i-auth.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { AuthMapper } from '../mappers/auth.mapper';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // User
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    return raw ? AuthMapper.toDomain(raw) : null;
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { userId },
      include: { role: true },
    });
    return raw ? AuthMapper.toDomain(raw) : null;
  }

  async createUser(data: CreateUserData): Promise<UserEntity> {
    const role = await this.prisma.role.findUniqueOrThrow({
      where: { code: data.roleCode as RoleCode },
    });

    const raw = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        roleId: role.roleId,
      },
      include: { role: true },
    });

    return AuthMapper.toDomain(raw);
  }

  async activateUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { isActive: true },
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { password: passwordHash },
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { lastLoginAt: new Date() },
    });
  }

  // OTP
  async createOtp(data: CreateOtpData): Promise<{ otpCodeId: string }> {
    const record = await this.prisma.otpCode.create({
      data: {
        userId: data.userId,
        type: data.type,
        otpHash: data.otpHash,
        otpSalt: data.otpSalt,
        expiresAt: data.expiresAt,
        lastSentAt: new Date(),
      },
    });
    return { otpCodeId: record.otpCodeId };
  }

  async findValidOtp(
    userId: string,
    type: OtpType,
  ): Promise<{
    otpCodeId: string;
    otpHash: string;
    resendCount: number;
    expiresAt: Date;
    verifiedAt: Date | null;
  } | null> {
    return await this.prisma.otpCode.findFirst({
      where: {
        userId,
        type,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        otpCodeId: true,
        otpHash: true,
        resendCount: true,
        expiresAt: true,
        verifiedAt: true,
      },
    });
  }

  async markOtpVerified(otpCodeId: string): Promise<void> {
    await this.prisma.otpCode.update({
      where: { otpCodeId },
      data: { verifiedAt: new Date() },
    });
  }

  async incrementOtpResend(otpCodeId: string): Promise<void> {
    await this.prisma.otpCode.update({
      where: { otpCodeId },
      data: {
        resendCount: { increment: 1 },
        lastSentAt: new Date(),
      },
    });
  }

  async invalidatePreviousOtps(userId: string, type: OtpType): Promise<void> {
    await this.prisma.otpCode.updateMany({
      where: { userId, type, verifiedAt: null },
      data: { expiresAt: new Date(0) },
    });
  }

  // Refresh token
  async saveRefreshToken(data: SaveRefreshTokenData): Promise<{ tokenId: string }> {
    const record = await this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        replacedByTokenId: data.replacedByTokenId,
      },
    });
    return { tokenId: record.tokenId };
  }

  async findRefreshToken(tokenHash: string): Promise<{
    tokenId: string;
    userId: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null> {
    return await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      select: {
        tokenId: true,
        userId: true,
        expiresAt: true,
        revokedAt: true,
      },
    });
  }

  async revokeRefreshToken(tokenId: string, replacedByTokenId?: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { tokenId },
      data: {
        revokedAt: new Date(),
        ...(replacedByTokenId ? { replacedByTokenId } : {}),
      },
    });
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
