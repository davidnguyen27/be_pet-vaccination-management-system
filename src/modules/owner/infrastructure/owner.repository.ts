import { Injectable } from '@nestjs/common';
import { GetOwnersFilter, IOwnerRepository, PaginatedResult, UpdateOwnerData } from '../domain/i-owner.repository';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { OwnerEntity } from '../domain/owner.entity';
import { OwnerMapper } from './owner.mapper';

@Injectable()
export class OwnerRepository implements IOwnerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: GetOwnersFilter): Promise<PaginatedResult<OwnerEntity>> {
    const { search, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause({ search });

    const [raws, total] = await this.prisma.$transaction([
      this.prisma.ownerProfile.findMany({
        where,
        include: {
          user: {
            include: { role: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.ownerProfile.count({ where }),
    ]);

    return {
      data: raws.map(raw => OwnerMapper.toDomain(raw)),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<OwnerEntity | null> {
    const raw = await this.prisma.ownerProfile.findUnique({
      where: { profileId: id },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    if (!raw || raw.user.isDeleted) {
      return null;
    }

    return OwnerMapper.toDomain(raw);
  }

  async findByUserId(userId: string): Promise<OwnerEntity | null> {
    const raw = await this.prisma.ownerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    if (!raw || raw.user.isDeleted) {
      return null;
    }

    return OwnerMapper.toDomain(raw);
  }

  async update(data: UpdateOwnerData): Promise<OwnerEntity> {
    const raw = await this.prisma.ownerProfile.update({
      where: { profileId: data.id },
      data: {
        ...(data.address !== undefined && { address: data.address }),
        ...(data.locationLat !== undefined && { locationLat: data.locationLat }),
        ...(data.locationLng !== undefined && { locationLng: data.locationLng }),
      },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    return OwnerMapper.toDomain(raw);
  }

  private buildWhereClause(filter: Pick<GetOwnersFilter, 'search'>) {
    return {
      user: {
        isDeleted: false,
      },
      ...(filter.search && {
        OR: [
          { user: { email: { contains: filter.search, mode: 'insensitive' as const } } },
          { user: { fullName: { contains: filter.search, mode: 'insensitive' as const } } },
          { user: { phoneNumber: { contains: filter.search, mode: 'insensitive' as const } } },
          { address: { contains: filter.search, mode: 'insensitive' as const } },
        ],
      }),
    };
  }
}
