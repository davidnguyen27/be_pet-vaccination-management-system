import { SpeciesResponseDto } from '../application/dtos/species-res.dto';
import { SpeciesEntity } from '../domain/species.entity';

interface SpeciesRaw {
  speciesId: string;
  name: string;
  code: string;
  defaultVaccinePlan: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class SpeciesMapper {
  static toDomain(raw: SpeciesRaw): SpeciesEntity {
    return new SpeciesEntity({
      id: raw.speciesId,
      name: raw.name,
      code: raw.code,
      defaultVaccinePlan: raw.defaultVaccinePlan,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toResponse(specie: SpeciesEntity): SpeciesResponseDto {
    return new SpeciesResponseDto({
      id: specie.id,
      name: specie.name,
      code: specie.code,
      defaultVaccinePlan: specie.defaultVaccinePlan,
      isDeleted: specie.isDeleted,
      createdAt: specie.createdAt,
      updatedAt: specie.updatedAt,
      deletedAt: specie.deletedAt,
    });
  }
}
