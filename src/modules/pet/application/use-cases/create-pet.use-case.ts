import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PetEntity } from '../../domain/pet.entity';
import { PetRepositoryPort } from '../ports/pet.repository.port';
import { PetDTO } from '../../presentation/http/dto/pet-request.dto';
import { PetModel } from '../model/pet.model';
import { PetQueryPort } from '../ports/pet.query.port';

@Injectable()
export class CreatePetUseCase {
  constructor(
    private readonly petRepo: PetRepositoryPort,
    private readonly petQuery: PetQueryPort,
  ) {}

  async execute(dto: PetDTO): Promise<PetModel> {
    const pet = PetEntity.create(randomUUID(), {
      ownerId: dto.ownerId,
      speciesId: dto.speciesId,
      name: dto.name,
      sex: dto.sex,
      dob: new Date(dto.dob),
      weight: dto.weight,
      color: dto.color,
      breed: dto.breed,
      note: dto.note ?? null,
      isSterilized: dto.isSterilized,
    });

    await this.petRepo.save(pet);

    return this.petQuery.findById(pet.id);
  }
}
