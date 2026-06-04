import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { weekday as PrismaWeekday } from '../../../../../generated/prisma/enums';
import { WorkingShiftModel } from '../../application/model/working-shift.model';
import { WorkingShiftQueryPort } from '../../application/ports/working-shift.query.port';
import { FindWorkingShiftOptions, PaginatedResult } from '../../application/ports/working-shift.repository.port';
import { WorkingShiftNotFoundError } from '../../domain/exceptions/working-shift.error';
import { Weekday } from '../../domain/working-shift.types';

type WorkingShiftWithVetRaw = Prisma.WorkingShiftGetPayload<{
  include: {
    vet: {
      select: {
        id: true;
        userId: true;
        licenseNo: true;
        employmentStatus: true;
        user: {
          select: {
            fullName: true;
            email: true;
            phoneNumber: true;
            avatarUrl: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class WorkingShiftQueryPortImp implements WorkingShiftQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<WorkingShiftModel> {
    const raw = await this.prisma.workingShift.findFirst({
      where: {
        id,
        isDeleted: false,
        vet: { user: { isDeleted: false } },
      },
      include: WorkingShiftQueryPortImp.includeRelations(),
    });

    if (!raw) throw new WorkingShiftNotFoundError(id);

    return this.toModel(raw);
  }

  async findMany(options: FindWorkingShiftOptions): Promise<PaginatedResult<WorkingShiftModel>> {
    const { page, limit, search, vetId, dayOfWeek } = options;
    const searchValue = search?.trim();
    const vetIdValue = vetId?.trim();

    const where: Prisma.WorkingShiftWhereInput = {
      isDeleted: false,
      vet: {
        user: { isDeleted: false },
        ...(vetIdValue && { id: vetIdValue }),
      },
      ...(dayOfWeek && { dayOfWeek: dayOfWeek as PrismaWeekday }),
      ...(searchValue && {
        OR: [
          { notes: { contains: searchValue, mode: 'insensitive' } },
          { vet: { licenseNo: { contains: searchValue, mode: 'insensitive' } } },
          { vet: { user: { fullName: { contains: searchValue, mode: 'insensitive' } } } },
          { vet: { user: { email: { contains: searchValue, mode: 'insensitive' } } } },
        ],
      }),
    };

    const [raws, totalItems] = await this.prisma.$transaction([
      this.prisma.workingShift.findMany({
        where,
        include: WorkingShiftQueryPortImp.includeRelations(),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      }),
      this.prisma.workingShift.count({ where }),
    ]);

    return {
      items: raws.map(raw => this.toModel(raw)),
      totalItems,
    };
  }

  private toModel(raw: WorkingShiftWithVetRaw): WorkingShiftModel {
    return {
      id: raw.id,
      vet: {
        id: raw.vet.id,
        userId: raw.vet.userId,
        fullName: raw.vet.user.fullName,
        email: raw.vet.user.email,
        phoneNumber: raw.vet.user.phoneNumber,
        avatarUrl: raw.vet.user.avatarUrl,
        licenseNo: raw.vet.licenseNo,
        employmentStatus: raw.vet.employmentStatus,
      },
      dayOfWeek: raw.dayOfWeek as Weekday,
      startTime: raw.startTime,
      endTime: raw.endTime,
      slotDuration: raw.slotDuration,
      maxAppointments: raw.maxAppointments,
      notes: raw.notes,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };
  }

  private static includeRelations() {
    return {
      vet: {
        select: {
          id: true,
          userId: true,
          licenseNo: true,
          employmentStatus: true,
          user: {
            select: {
              fullName: true,
              email: true,
              phoneNumber: true,
              avatarUrl: true,
            },
          },
        },
      },
    } satisfies Prisma.WorkingShiftInclude;
  }
}
