import { Injectable } from '@nestjs/common';
import { IVetRepository, PaginatedResult, UpdateVetData } from '../domain/i-vet.repository';
import { VetEntity } from '../domain/vet.entity';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { VetMapper } from './vet.mapper';
import { Params } from '@/shared/domain/query-params.type';

@Injectable()
export class VetRepository implements IVetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: Params): Promise<PaginatedResult<VetEntity>> {
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
      this.prisma.vetProfile.findMany({
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
      this.prisma.vetProfile.count({ where }),
    ]);

    return {
      data: raws.map(raw => VetMapper.toDomain(raw)),
      total,
      page,
      limit,
    };
  }

  async findById(profileId: string): Promise<VetEntity | null> {
    const raw = await this.prisma.vetProfile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    if (!raw || raw.user.isDeleted) {
      return null;
    }

    return VetMapper.toDomain(raw);
  }

  async findByUserId(userId: string): Promise<VetEntity | null> {
    const raw = await this.prisma.vetProfile.findUnique({
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

    return VetMapper.toDomain(raw);
  }

  async update(data: UpdateVetData): Promise<VetEntity> {
    const raw = await this.prisma.vetProfile.update({
      where: { userId: data.userId },
      data: {
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.citizenId !== undefined && { citizenId: data.citizenId }),
        ...(data.joinDate !== undefined && { joinDate: data.joinDate }),
        ...(data.endDate !== undefined && { endDate: data.endDate }),
        ...(data.licenseIssueBy !== undefined && { licenseIssueBy: data.licenseIssueBy }),
        ...(data.licenseNo !== undefined && { licenseNo: data.licenseNo }),
        ...(data.licenseValidFrom !== undefined && { licenseValidFrom: data.licenseValidFrom }),
        ...(data.licenseValidTo !== undefined && { licenseValidTo: data.licenseValidTo }),
        ...(data.employmentStatus !== undefined && { employmentStatus: data.employmentStatus }),
      },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    return VetMapper.toDomain(raw);
  }
}
