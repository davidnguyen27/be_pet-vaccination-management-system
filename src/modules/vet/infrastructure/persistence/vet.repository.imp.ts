import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { FindVetOptions, PaginatedResult, VetRepositoryPort } from '../../application/ports/vet.repository.port';
import { VetNotFoundError } from '../../domain/exceptions/vet.error';
import { VetEntity } from '../../domain/vet.entity';
import { VetMapper } from './vet.mapper';

@Injectable()
export class VetRepositoryImp implements VetRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserIdOrThrow(userId: string): Promise<VetEntity> {
    const raw = await this.prisma.vetProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!raw || raw.user.isDeleted) {
      throw new VetNotFoundError(userId);
    }

    return VetMapper.toDomain(raw);
  }

  async findMany(options: FindVetOptions): Promise<PaginatedResult<VetEntity>> {
    const { search, page, limit } = options;
    const normalizedSearch = search?.trim();

    const where: Prisma.VetProfileWhereInput = {
      user: {
        isDeleted: false,
      },
      ...(normalizedSearch && {
        OR: [
          { bio: { contains: normalizedSearch, mode: 'insensitive' } },
          { licenseNo: { contains: normalizedSearch, mode: 'insensitive' } },
          { licenseIssueBy: { contains: normalizedSearch, mode: 'insensitive' } },
          { citizenId: { contains: normalizedSearch, mode: 'insensitive' } },
          { address: { contains: normalizedSearch, mode: 'insensitive' } },
          { user: { email: { contains: normalizedSearch, mode: 'insensitive' } } },
          { user: { fullName: { contains: normalizedSearch, mode: 'insensitive' } } },
          { user: { phoneNumber: { contains: normalizedSearch, mode: 'insensitive' } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.vetProfile.findMany({
        where,
        include: {
          user: {
            include: { role: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vetProfile.count({ where }),
    ]);

    return {
      items: raws.map(raw => VetMapper.toDomain(raw)),
      totalItems,
    };
  }

  async save(vet: VetEntity): Promise<void> {
    await this.prisma.vetProfile.upsert({
      where: { id: vet.id },
      create: VetMapper.toPrismaCreate(vet),
      update: VetMapper.toPrismaUpdate(vet),
    });
  }
}
