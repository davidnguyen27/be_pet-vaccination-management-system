import { PetResponseDto } from '../application/dtos/pet-res.dto';
import { PetEntity } from '../domain/pet.entity';

interface PetMapperRaw {
  petId: string;
  ownerId: string;
  name: string;
  speciesId: string;
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
      id: raw.petId,
      ownerId: raw.ownerId,
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
