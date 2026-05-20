import { Injectable } from '@nestjs/common';
import { PetRepositoryPort } from '../ports/pet.repository.port';
import { PetDTO } from '../../presentation/http/dto/pet-request.dto';
import { PetModel } from '../model/pet.model';
import { PetQueryPort } from '../ports/pet.query.port';

@Injectable()
export class UpdatePetUseCase {
  constructor(
    private readonly petRepo: PetRepositoryPort,
    private readonly petQuery: PetQueryPort,
  ) {}

  async execute(petId: string, dto: PetDTO): Promise<PetModel> {
    const pet = await this.petRepo.findByIdOrThrow(petId);

    pet.update({
      ownerId: dto.ownerId,
      speciesId: dto.speciesId,
      name: dto.name,
      sex: dto.sex,
      dob: new Date(dto.dob),
      weight: dto.weight,
      color: dto.color,
      breed: dto.breed,
      note: dto.note,
      isSterilized: dto.isSterilized,
    });

    await this.petRepo.save(pet);

    return this.petQuery.findById(pet.id);
  }
}
