import { Injectable } from '@nestjs/common';
import { PetRepositoryPort } from '../ports/pet.repository.port';

@Injectable()
export class DeletePetUseCase {
  constructor(private readonly petRepo: PetRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const pet = await this.petRepo.findByIdOrThrow(id);
    pet.softDelete();
    await this.petRepo.save(pet);
  }
}
