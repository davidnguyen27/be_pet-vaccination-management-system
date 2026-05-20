import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { OwnerNotFoundError } from '../../domain/exceptions/owner.error';
import { FindOwnerOptions, OwnerRepositoryPort, PaginatedResult } from '../../application/ports/owner.repository.port';
import { OwnerEntity } from '../../domain/owner.entity';
import { OwnerMapper } from './owner.mapper';

@Injectable()
export class OwnerRepositoryImp implements OwnerRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserIdOrThrow(userId: string): Promise<OwnerEntity> {
    const raw = await this.prisma.ownerProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!raw || raw.user.isDeleted) {
      throw new OwnerNotFoundError(userId);
    }

    return OwnerMapper.toDomain(raw);
  }

  async findMany(options: FindOwnerOptions): Promise<PaginatedResult<OwnerEntity>> {
    const { page, limit, search } = options;
    const normalizedSearch = search?.trim();

    const where: Prisma.OwnerProfileWhereInput = {
      user: { isDeleted: false },
      ...(normalizedSearch && {
        OR: [
          { address: { contains: normalizedSearch, mode: 'insensitive' } },
          { user: { email: { contains: normalizedSearch, mode: 'insensitive' } } },
          { user: { fullName: { contains: normalizedSearch, mode: 'insensitive' } } },
          { user: { phoneNumber: { contains: normalizedSearch, mode: 'insensitive' } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.ownerProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.ownerProfile.count({ where }),
    ]);

    return {
      items: raws.map(raw => OwnerMapper.toDomain(raw)),
      totalItems,
    };
  }

  async save(owner: OwnerEntity): Promise<void> {
    await this.prisma.ownerProfile.upsert({
      where: { id: owner.id },
      create: OwnerMapper.toPrismaCreate(owner),
      update: OwnerMapper.toPrismaUpdate(owner),
    });
  }
}
