import { Injectable } from '@nestjs/common';
import { FindUserOptions, PaginatedResult, UserRepositoryPort } from '../../application/ports/user.repository.port';
import { UserEntity } from '../../domain/user.entity';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { UserPrismaMapper } from './user.mapper';
import { Prisma, RoleCode as PrismaRoleCode } from '../../../../../generated/prisma/client';
import { UserNotFoundError } from '../../domain/exceptions/user.error';

@Injectable()
export class UserRepositoryImpl implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    return raw ? UserPrismaMapper.toDomain(raw) : null;
  }

  async findByIdOrThrow(id: string): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) throw new UserNotFoundError(id);
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    return raw ? UserPrismaMapper.toDomain(raw) : null;
  }

  async findMany({ page, limit, search, isActive, roleCode }: FindUserOptions): Promise<PaginatedResult<UserEntity>> {
    const where: Prisma.UserWhereInput = {
      isDeleted: false,
      ...(isActive !== undefined && { isActive }),
      ...(roleCode && { role: { code: roleCode as PrismaRoleCode } }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [raws, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: { role: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: raws.map(raw => UserPrismaMapper.toDomain(raw)),
      total,
    };
  }

  async save(user: UserEntity): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: UserPrismaMapper.toPrismaCreate(user),
      update: UserPrismaMapper.toPrismaUpdate(user),
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
}
