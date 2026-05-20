import { VaccineStatus } from '@/enums/vaccine';
import { Prisma } from '../../../../../generated/prisma/client';
import { VaccineEntity } from '../../domain/vaccine.entity';

export type VaccineRaw = Prisma.VaccineGetPayload<{ include: { species: { select: { name: true } } } }>;

export class VaccinePrismaMapper {
  static toDomain(raw: VaccineRaw): VaccineEntity {
    return VaccineEntity.reconstitute(raw.id, {
      speciesId: raw.speciesId,
      code: raw.code,
      name: raw.name,
      brand: raw.brand,
      imgUrl: raw.imgUrl,
      description: raw.description,
      doseValue: raw.doseValue,
      doseUnit: raw.doseUnit,
      status: raw.status as VaccineStatus,
      defaultTotalDoses: raw.defaultTotalDoses,
      defaultNextDueDays: raw.defaultNextDueDays,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPrismaCreate(vaccine: VaccineEntity) {
    return {
      id: vaccine.id,
      speciesId: vaccine.speciesId,
      code: vaccine.code,
      name: vaccine.name,
      brand: vaccine.brand,
      imgUrl: vaccine.imgUrl,
      description: vaccine.description,
      doseValue: vaccine.doseValue,
      doseUnit: vaccine.doseUnit,
      status: vaccine.status,
      defaultTotalDoses: vaccine.defaultTotalDoses,
      defaultNextDueDays: vaccine.defaultNextDueDays,
      isDeleted: vaccine.isDeleted,
      createdAt: vaccine.createdAt,
      updatedAt: vaccine.updatedAt,
      deletedAt: vaccine.deletedAt,
    };
  }

  static toPrismaUpdate(vaccine: VaccineEntity) {
    return {
      speciesId: vaccine.speciesId,
      code: vaccine.code,
      name: vaccine.name,
      brand: vaccine.brand,
      imgUrl: vaccine.imgUrl,
      description: vaccine.description,
      doseValue: vaccine.doseValue,
      doseUnit: vaccine.doseUnit,
      status: vaccine.status,
      defaultTotalDoses: vaccine.defaultTotalDoses,
      defaultNextDueDays: vaccine.defaultNextDueDays,
      isDeleted: vaccine.isDeleted,
      updatedAt: vaccine.updatedAt,
      deletedAt: vaccine.deletedAt,
    };
  }
}
