import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IStaffRepository, PaginatedResult, UpdateStaffData } from '../domain/i-staff.repository';
import { StaffEntity } from '../domain/staff.entity';
import { StaffMapper } from './staff.mapper';
import { Params } from '@/shared/domain/query-params.type';

@Injectable()
export class StaffRepository implements IStaffRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: Params): Promise<PaginatedResult<StaffEntity>> {
    const { search, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause({ search });

    const [raws, total] = await this.prisma.$transaction([
      this.prisma.staffProfile.findMany({
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
      this.prisma.staffProfile.count({ where }),
    ]);

    return {
      data: raws.map(raw => StaffMapper.toDomain(raw)),
      total,
      page,
      limit,
    };
  }

  async findById(profileId: string): Promise<StaffEntity | null> {
    const raw = await this.prisma.staffProfile.findUnique({
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

    return StaffMapper.toDomain(raw);
  }

  async findByUserId(userId: string): Promise<StaffEntity | null> {
    const raw = await this.prisma.staffProfile.findUnique({
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

    return StaffMapper.toDomain(raw);
  }

  async update(data: UpdateStaffData): Promise<StaffEntity> {
    const raw = await this.prisma.staffProfile.update({
      where: { userId: data.userId },
      data: {
        ...(data.jobTitle !== undefined && { jobTitle: data.jobTitle }),
        ...(data.department !== undefined && { department: data.department }),
        ...(data.employmentType !== undefined && { employmentType: data.employmentType }),
        ...(data.employmentStatus !== undefined && { employmentStatus: data.employmentStatus }),
        ...(data.joinDate !== undefined && { joinDate: data.joinDate }),
        ...(data.endDate !== undefined && { endDate: data.endDate }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.citizenId !== undefined && { citizenId: data.citizenId }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    return StaffMapper.toDomain(raw);
  }

  private buildWhereClause(filter: Pick<Params, 'search'>) {
    return {
      user: {
        isDeleted: false,
      },
      ...(filter.search && {
        OR: [
          { code: { contains: filter.search, mode: 'insensitive' as const } },
          { jobTitle: { contains: filter.search, mode: 'insensitive' as const } },
          { department: { contains: filter.search, mode: 'insensitive' as const } },
          { citizenId: { contains: filter.search, mode: 'insensitive' as const } },
          { user: { email: { contains: filter.search, mode: 'insensitive' as const } } },
          { user: { fullName: { contains: filter.search, mode: 'insensitive' as const } } },
          { user: { phoneNumber: { contains: filter.search, mode: 'insensitive' as const } } },
        ],
      }),
    };
  }
}
