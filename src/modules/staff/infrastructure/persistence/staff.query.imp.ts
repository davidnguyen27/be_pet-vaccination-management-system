import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { StaffQueryPort } from '../../application/ports/staff.query.port';
import { Injectable } from '@nestjs/common';
import { StaffModel } from '../../application/model/staff.model';
import { FindStaffOptions, PaginatedResult } from '../../application/ports/staff.repository.port';
import { Prisma } from '../../../../../generated/prisma/client';
import { NotFoundError } from '../../domain/exceptions/staff.error';

type StaffWithUserRaw = Prisma.StaffProfileGetPayload<{ include: { user: { include: { role: true } } } }>;

@Injectable()
export class StaffQueryImp implements StaffQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<StaffModel> {
    const raw = await this.prisma.staffProfile.findUnique({
      where: { userId },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    if (!raw || raw.user.isDeleted) {
      throw new NotFoundError(userId);
    }

    return this.toModel(raw);
  }

  async findMany(options: FindStaffOptions): Promise<PaginatedResult<StaffModel>> {
    const { page, limit, search } = options;
    const normalizedSearch = search?.trim();

    const where: Prisma.StaffProfileWhereInput = {
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
      this.prisma.staffProfile.findMany({
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
      this.prisma.staffProfile.count({ where }),
    ]);

    return {
      items: raws.map(raw => this.toModel(raw)),
      totalItems,
    };
  }

  private toModel(raw: StaffWithUserRaw): StaffModel {
    return {
      id: raw.id,
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
      code: raw.code,
      jobTitle: raw.jobTitle,
      department: raw.department,
      employmentType: raw.employmentType,
      employmentStatus: raw.employmentStatus,
      joinDate: raw.joinDate,
      endDate: raw.endDate,
      address: raw.address,
      citizenId: raw.citizenId,
      notes: raw.notes,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
