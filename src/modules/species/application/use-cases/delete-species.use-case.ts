import { Injectable } from '@nestjs/common';
import { SpeciesDeletedError } from '../../domain/exceptions/species.error';
import { SpeciesRepositoryPort } from '../ports/species.repository.port';

@Injectable()
export class DeleteSpeciesUseCase {
  constructor(private readonly speciesRepo: SpeciesRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const species = await this.speciesRepo.findByIdOrThrow(id);

    if (species.isDeleted) {
      throw new SpeciesDeletedError(id);
    }

    species.softDelete();
    await this.speciesRepo.save(species);
  }
}
