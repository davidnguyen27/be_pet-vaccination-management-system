import { PetResponseDTO } from '../dto/pet-response.dto';
import { PetModel } from '../../../application/model/pet.model';

export class PetHttpMapper {
  static toResponse(pet: PetModel): PetResponseDTO {
    return {
      id: pet.id,
      owner: {
        id: pet.owner.id,
        user: {
          id: pet.owner.user.id,
          role: pet.owner.user.role,
          email: pet.owner.user.email,
          fullName: pet.owner.user.fullName,
          phoneNumber: pet.owner.user.phoneNumber,
          avatarUrl: pet.owner.user.avatarUrl,
          dob: pet.owner.user.dob?.toISOString() ?? null,
        },
        address: pet.owner.address,
        locationLat: pet.owner.locationLat,
        locationLng: pet.owner.locationLng,
        totalPoints: pet.owner.totalPoints,
      },
      species: pet.species,
      name: pet.name,
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
    };
  }

  static toResponseList(items: PetModel[]): PetResponseDTO[] {
    return items.map(item => this.toResponse(item));
  }
}
