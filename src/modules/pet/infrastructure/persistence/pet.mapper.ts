import { Prisma } from '../../../../../generated/prisma/client';
import { PetEntity } from '../../domain/pet.entity';

type PetRaw = Prisma.PetGetPayload<{
  include: {
    owner: true;
    species: true;
  };
}>;

export class PetPrismaMapper {
  static toDomain(raw: PetRaw): PetEntity {
    return PetEntity.reconstitute(raw.id, {
      ownerId: raw.ownerId,
      speciesId: raw.speciesId,
      name: raw.name,
      sex: raw.sex,
      dob: raw.dob,
      weight: raw.weight,
      color: raw.color,
      breed: raw.breed,
      note: raw.note,
      isSterilized: raw.isSterilized,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPrismaCreate(pet: PetEntity) {
    return {
      id: pet.id,
      ownerId: pet.ownerId,
      speciesId: pet.speciesId,
      name: pet.name,
      sex: pet.sex,
      dob: pet.dob,
      weight: pet.weight,
      color: pet.color,
      breed: pet.breed,
      note: pet.note,
      isSterilized: pet.isSterilized,
      isDeleted: pet.isDeleted,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
      deletedAt: pet.deletedAt,
    };
  }

  static toPrismaUpdate(pet: PetEntity) {
    return {
      ownerId: pet.ownerId,
      speciesId: pet.speciesId,
      name: pet.name,
      sex: pet.sex,
      dob: pet.dob,
      weight: pet.weight,
      color: pet.color,
      breed: pet.breed,
      note: pet.note,
      isSterilized: pet.isSterilized,
      isDeleted: pet.isDeleted,
      updatedAt: pet.updatedAt,
      deletedAt: pet.deletedAt,
    };
  }
}
