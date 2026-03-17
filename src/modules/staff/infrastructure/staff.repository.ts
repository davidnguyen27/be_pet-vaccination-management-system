import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetStaffFilter, IStaffRepository, PaginatedResult, UpdateStaffData } from '../domain/i-staff.repository';
import { StaffEntity } from '../domain/staff.entity';
import { StaffMapper } from './staff.mapper';

@Injectable()
export class StaffRepository implements IStaffRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: GetStaffFilter): Promise<PaginatedResult<StaffEntity>> {
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
      data: raws.map(raw => StaffMapper.toDomain(raw as any)),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<StaffEntity | null> {
    const raw = await this.prisma.staffProfile.findUnique({
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

    return StaffMapper.toDomain(raw as any);
  }

  async update(data: UpdateStaffData): Promise<StaffEntity> {
    const raw = await this.prisma.staffProfile.update({
      where: { code: data.code },
      data: {
        ...(data.jobTitle !== undefined && { jobTitle: data.jobTitle }),
        ...(data.department !== undefined && { department: data.department }),
        employmentType: data.employmentType,
        employmentStatus: data.employmentStatus,
        joinDate: new Date(data.joinDate),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        address: data.address,
        citizenId: data.citizenId,
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    return StaffMapper.toDomain(raw as any);
  }

  private buildWhereClause(filter: Pick<GetStaffFilter, 'search'>) {
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
