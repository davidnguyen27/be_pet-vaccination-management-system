import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { FindStaffOptions, PaginatedResult, StaffRepositoryPort } from '../../application/ports/staff.repository.port';
import { NotFoundError } from '../../domain/exceptions/staff.error';
import { StaffEntity } from '../../domain/staff.entity';
import { StaffMapper } from './staff.mapper';

@Injectable()
export class StaffRepositoryImpl implements StaffRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserIdOrThrow(userId: string): Promise<StaffEntity> {
    const raw = await this.prisma.staffProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!raw || raw.user.isDeleted) {
      throw new NotFoundError(userId);
    }

    return StaffMapper.toDomain(raw);
  }

  async findMany(options: FindStaffOptions): Promise<PaginatedResult<StaffEntity>> {
    const { search, page, limit } = options;
    const normalizedSearch = search?.trim();

    const where: Prisma.StaffProfileWhereInput = {
      user: { isDeleted: false },
      ...(normalizedSearch && {
        OR: [
          { code: { contains: normalizedSearch, mode: 'insensitive' } },
          { jobTitle: { contains: normalizedSearch, mode: 'insensitive' } },
          { department: { contains: normalizedSearch, mode: 'insensitive' } },
          { citizenId: { contains: normalizedSearch, mode: 'insensitive' } },
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
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.staffProfile.count({ where }),
    ]);

    return {
      items: raws.map(raw => StaffMapper.toDomain(raw)),
      totalItems,
    };
  }

  async save(staff: StaffEntity): Promise<void> {
    await this.prisma.staffProfile.upsert({
      where: { id: staff.id },
      create: StaffMapper.toPrismaCreate(staff),
      update: StaffMapper.toPrismaUpdate(staff),
    });
  }
}
