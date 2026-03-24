import { Injectable } from '@nestjs/common';
import { IOwnerRepository, UpdateOwnerData } from '../domain/i-owner.repository';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { OwnerEntity } from '../domain/owner.entity';
import { OwnerMapper } from './owner.mapper';
import type { PaginatedResult } from '@/shared/domain/paginated-result.type';
import { Params } from '@/shared/domain/query-params.type';

@Injectable()
export class OwnerRepository implements IOwnerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: Params): Promise<PaginatedResult<OwnerEntity>> {
    const { search, page, limit } = params;
    const skip = (page - 1) * limit;

    const where = {
      user: {
        isDeleted: false,
      },
      ...(search && {
        OR: [
          { user: { email: { contains: search, mode: 'insensitive' as const } } },
          { user: { fullName: { contains: search, mode: 'insensitive' as const } } },
          { user: { phoneNumber: { contains: search, mode: 'insensitive' as const } } },
          { address: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

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
      where: { id: id },
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
      where: { userId: data.userId },
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
}
