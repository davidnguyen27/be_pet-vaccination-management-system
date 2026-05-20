import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { OwnerNotFoundError } from '../../domain/exceptions/owner.error';
import { FindOwnerOptions, PaginatedResult } from '../../application/ports/owner.repository.port';
import { OwnerQueryPort } from '../../application/ports/owner.query.port';
import { OwnerModel } from '../../application/model/owner.model';

type OwnerWithUserRaw = Prisma.OwnerProfileGetPayload<{ include: { user: { include: { role: true } } } }>;

@Injectable()
export class OwnerQueryImp implements OwnerQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<OwnerModel> {
    const raw = await this.prisma.ownerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    if (!raw || raw.user.isDeleted) {
      throw new OwnerNotFoundError(userId);
    }

    return this.toModel(raw);
  }

  async findMany(options: FindOwnerOptions): Promise<PaginatedResult<OwnerModel>> {
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
        include: {
          user: {
            include: { role: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.ownerProfile.count({ where }),
    ]);

    return {
      items: raws.map(raw => this.toModel(raw)),
      totalItems,
    };
  }

  private toModel(raw: OwnerWithUserRaw): OwnerModel {
    return {
      id: raw.id,
      userId: raw.userId,
      user: {
        id: raw.user.id,
        role: raw.user.role.name,
        email: raw.user.email,
        fullName: raw.user.fullName ?? null,
        phoneNumber: raw.user.phoneNumber ?? null,
        avatarUrl: raw.user.avatarUrl ?? null,
        dob: raw.user.dob ?? null,
        isActive: raw.user.isActive,
        isDeleted: raw.user.isDeleted,
      },
      address: raw.address,
      locationLat: raw.locationLat,
      locationLng: raw.locationLng,
      totalPoints: raw.totalPoints,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
