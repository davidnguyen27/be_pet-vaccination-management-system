import { Prisma } from '../../../../../generated/prisma/client';
import { weekday as PrismaWeekday } from '../../../../../generated/prisma/enums';
import { WorkingShiftEntity } from '../../domain/working-shift.entity';
import { Weekday } from '../../domain/working-shift.types';

export type WorkingShiftRaw = Prisma.WorkingShiftGetPayload<object>;

export class WorkingShiftPrismaMapper {
  static toDomain(raw: WorkingShiftRaw): WorkingShiftEntity {
    return WorkingShiftEntity.reconstitute(raw.id, {
      vetId: raw.vetId,
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
    });
  }

  static toPrismaCreate(workingShift: WorkingShiftEntity) {
    return {
      id: workingShift.id,
      vetId: workingShift.vetId,
      dayOfWeek: workingShift.dayOfWeek as PrismaWeekday,
      startTime: workingShift.startTime,
      endTime: workingShift.endTime,
      slotDuration: workingShift.slotDuration,
      maxAppointments: workingShift.maxAppointments,
      notes: workingShift.notes,
      isDeleted: workingShift.isDeleted,
      createdAt: workingShift.createdAt,
      updatedAt: workingShift.updatedAt,
      deletedAt: workingShift.deletedAt,
    };
  }

  static toPrismaUpdate(workingShift: WorkingShiftEntity) {
    return {
      vetId: workingShift.vetId,
      dayOfWeek: workingShift.dayOfWeek as PrismaWeekday,
      startTime: workingShift.startTime,
      endTime: workingShift.endTime,
      slotDuration: workingShift.slotDuration,
      maxAppointments: workingShift.maxAppointments,
      notes: workingShift.notes,
      isDeleted: workingShift.isDeleted,
      updatedAt: workingShift.updatedAt,
      deletedAt: workingShift.deletedAt,
    };
  }
}
