import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { weekday as PrismaWeekday } from '../../../../../generated/prisma/enums';
import {
  WorkingShiftOverlapCriteria,
  WorkingShiftRepositoryPort,
} from '../../application/ports/working-shift.repository.port';
import { WorkingShiftNotFoundError } from '../../domain/exceptions/working-shift.error';
import { WorkingShiftEntity } from '../../domain/working-shift.entity';
import { WorkingShiftPrismaMapper } from './working-shift.mapper';

@Injectable()
export class WorkingShiftRepository implements WorkingShiftRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<WorkingShiftEntity | null> {
    const raw = await this.prisma.workingShift.findFirst({
      where: { id, isDeleted: false },
    });

    return raw ? WorkingShiftPrismaMapper.toDomain(raw) : null;
  }

  async findByIdOrThrow(id: string): Promise<WorkingShiftEntity> {
    const workingShift = await this.findById(id);
    if (!workingShift) throw new WorkingShiftNotFoundError(id);
    return workingShift;
  }

  async existsVet(vetId: string): Promise<boolean> {
    const normalizedId = vetId.trim();
    if (!normalizedId) return false;

    const count = await this.prisma.vetProfile.count({
      where: {
        id: normalizedId,
        user: { isDeleted: false },
      },
    });

    return count > 0;
  }

  async existsOverlappingShift(criteria: WorkingShiftOverlapCriteria): Promise<boolean> {
    const count = await this.prisma.workingShift.count({
      where: {
        vetId: criteria.vetId,
        dayOfWeek: criteria.dayOfWeek as PrismaWeekday,
        isDeleted: false,
        startTime: { lt: criteria.endTime },
        endTime: { gt: criteria.startTime },
        ...(criteria.excludeId && { NOT: { id: criteria.excludeId } }),
      },
    });

    return count > 0;
  }

  async save(workingShift: WorkingShiftEntity): Promise<void> {
    await this.prisma.workingShift.upsert({
      where: { id: workingShift.id },
      create: WorkingShiftPrismaMapper.toPrismaCreate(workingShift),
      update: WorkingShiftPrismaMapper.toPrismaUpdate(workingShift),
    });
  }
}
