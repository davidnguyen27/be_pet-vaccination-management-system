import { VaccinePlanStatus } from '@/enums/vaccine';
import { Prisma } from '../../../../../generated/prisma/client';
import { VaccinePlanEntity } from '../../domain/vaccine-plan.entity';

export type VaccinePlanRaw = Prisma.VaccinePlanGetPayload<object>;

export class VaccinePlanPrismaMapper {
  static toDomain(raw: VaccinePlanRaw): VaccinePlanEntity {
    return VaccinePlanEntity.reconstitute(raw.id, {
      petId: raw.petId,
      vaccineId: raw.vaccineId,
      doseNo: raw.doseNo,
      dueDate: raw.dueDate,
      dueFrom: raw.dueFrom,
      dueTo: raw.dueTo,
      status: raw.status as VaccinePlanStatus,
      vaccinationRecordId: raw.vaccinationRecordId,
      completedAt: raw.completedAt,
      remindAt: raw.remindAt,
      lastRemindedAt: raw.lastRemindedAt,
      note: raw.note,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPrismaCreate(vaccinePlan: VaccinePlanEntity) {
    return {
      id: vaccinePlan.id,
      petId: vaccinePlan.petId,
      vaccineId: vaccinePlan.vaccineId,
      doseNo: vaccinePlan.doseNo,
      dueDate: vaccinePlan.dueDate,
      dueFrom: vaccinePlan.dueFrom,
      dueTo: vaccinePlan.dueTo,
      status: vaccinePlan.status,
      vaccinationRecordId: vaccinePlan.vaccinationRecordId,
      completedAt: vaccinePlan.completedAt,
      remindAt: vaccinePlan.remindAt,
      lastRemindedAt: vaccinePlan.lastRemindedAt,
      note: vaccinePlan.note,
      isDeleted: vaccinePlan.isDeleted,
      createdAt: vaccinePlan.createdAt,
      updatedAt: vaccinePlan.updatedAt,
      deletedAt: vaccinePlan.deletedAt,
    };
  }

  static toPrismaUpdate(vaccinePlan: VaccinePlanEntity) {
    return {
      petId: vaccinePlan.petId,
      vaccineId: vaccinePlan.vaccineId,
      doseNo: vaccinePlan.doseNo,
      dueDate: vaccinePlan.dueDate,
      dueFrom: vaccinePlan.dueFrom,
      dueTo: vaccinePlan.dueTo,
      status: vaccinePlan.status,
      vaccinationRecordId: vaccinePlan.vaccinationRecordId,
      completedAt: vaccinePlan.completedAt,
      remindAt: vaccinePlan.remindAt,
      lastRemindedAt: vaccinePlan.lastRemindedAt,
      note: vaccinePlan.note,
      isDeleted: vaccinePlan.isDeleted,
      updatedAt: vaccinePlan.updatedAt,
      deletedAt: vaccinePlan.deletedAt,
    };
  }
}
