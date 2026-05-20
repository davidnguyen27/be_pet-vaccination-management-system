import { SpeciesEntity } from '../../../domain/species.entity';
import { SpeciesResponseDTO } from '../dto/species-response.dto';

export class SpeciesHttpMapper {
  static toResponse(entity: SpeciesEntity): SpeciesResponseDTO {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      defaultVaccinePlan: entity.defaultVaccinePlan,
      isDeleted: entity.isDeleted,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString() ?? null,
    };
  }

  static toResponseList(entities: SpeciesEntity[]): SpeciesResponseDTO[] {
    return entities.map(this.toResponse.bind(this));
  }
}
