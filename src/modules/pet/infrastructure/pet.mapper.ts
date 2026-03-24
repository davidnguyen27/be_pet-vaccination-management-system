import { SpeciesMapper } from '@/modules/species/infrastructure/species.mapper';
import { PetResponseDto } from '../application/dtos/pet-res.dto';
import { PetEntity } from '../domain/pet.entity';
import { OwnerMapper } from '@/modules/owner/infrastructure/owner.mapper';

interface PetMapperRaw {
  id: string;
  ownerId: string;
  owner?: Parameters<typeof OwnerMapper.toDomain>[0];
  speciesId: string;
  species?: Parameters<typeof SpeciesMapper.toDomain>[0];
  name: string;
  sex: string;
  dob: Date;
  weight: number;
  color: string;
  breed: string;
  note: string | null;
  isSterilized: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class PetMapper {
  static toDomain(raw: PetMapperRaw): PetEntity {
    return new PetEntity({
      id: raw.id,
      ownerId: raw.ownerId,
      owner: raw.owner ? OwnerMapper.toDomain(raw.owner) : undefined,
      name: raw.name,
      speciesId: raw.speciesId,
      species: raw.species ? SpeciesMapper.toDomain(raw.species) : undefined,
      sex: raw.sex,
      dob: raw.dob,
      weight: raw.weight,
      color: raw.color,
      breed: raw.breed,
      note: raw.note,
      isSterilized: raw.isSterilized,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toResponse(pet: PetEntity): PetResponseDto {
    return new PetResponseDto({
      id: pet.id,
      owner: pet.owner ? OwnerMapper.toResponse(pet.owner) : undefined,
      name: pet.name,
      species: pet.species ? SpeciesMapper.toResponse(pet.species) : undefined,
      sex: pet.sex,
      dob: pet.dob,
      weight: pet.weight,
      color: pet.color,
      breed: pet.breed,
      note: pet.note,
      isSterilized: pet.isSterilized,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
      deletedAt: pet.deletedAt,
    });
  }
}
