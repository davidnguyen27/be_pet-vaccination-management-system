import { Species } from '../../../../../generated/prisma/client';
import { SpeciesEntity } from '../../domain/species.entity';

export class SpeciesPrismaMapper {
  // Prisma model -> Domain entity
  static toDomain(raw: Species): SpeciesEntity {
    return SpeciesEntity.reconstitute(raw.id, {
      name: raw.name,
      code: raw.code,
      defaultVaccinePlan: raw.defaultVaccinePlan,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  // Domain entity -> Prisma model
  static toPrismaCreate(entity: SpeciesEntity) {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      defaultVaccinePlan: entity.defaultVaccinePlan,
      isDeleted: entity.isDeleted,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  // Domain entity -> Prisma model for updates (partial)
  static toPrismaUpdate(entity: SpeciesEntity) {
    return {
      name: entity.name,
      code: entity.code,
      defaultVaccinePlan: entity.defaultVaccinePlan,
      isDeleted: entity.isDeleted,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
