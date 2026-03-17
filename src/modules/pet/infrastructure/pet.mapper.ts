import { PetResponseDto } from '../application/dtos/pet-res.dto';
import { PetEntity } from '../domain/pet.entity';
import { OwnerMapper } from '@/modules/owner/infrastructure/owner.mapper';

interface PetMapperRaw {
  petId: string;
  ownerId: string;
  owner?: Parameters<typeof OwnerMapper.toDomain>[0];
  name: string;
  speciesId: string;
  sex: PetEntity['sex'];
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
      id: raw.petId,
      ownerId: raw.ownerId,
      owner: raw.owner ? OwnerMapper.toDomain(raw.owner) : undefined,
      name: raw.name,
      speciesId: raw.speciesId,
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
      ownerId: pet.ownerId,
      owner: pet.owner ? OwnerMapper.toResponse(pet.owner) : null,
      name: pet.name,
      speciesId: pet.speciesId,
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
