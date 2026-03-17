import { Injectable } from '@nestjs/common';
import { GetVetsFilter, IVetRepository, PaginatedResult, UpdateVetData } from '../domain/i-vet.repository';
import { VetEntity } from '../domain/vet.entity';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { VetMapper } from './vet.mapper';

@Injectable()
export class VetRepository implements IVetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: GetVetsFilter): Promise<PaginatedResult<VetEntity>> {
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
      data: raws.map(raw => VetMapper.toDomain(raw as any)),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<VetEntity | null> {
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

    return VetMapper.toDomain(raw as any);
  }

  async findByUserId(userId: string): Promise<VetEntity | null> {
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

    return VetMapper.toDomain(raw as any);
  }

  async update(data: UpdateVetData): Promise<VetEntity> {
    const raw = await this.prisma.ownerProfile.update({
      where: { profileId: data.id },
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

    return VetMapper.toDomain(raw as any);
  }

  private buildWhereClause(filter: Pick<GetVetsFilter, 'search'>) {
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
