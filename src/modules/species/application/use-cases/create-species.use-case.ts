import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SpeciesCodeAlreadyExistsError, SpeciesNameAlreadyExistsError } from '../../domain/exceptions/species.error';
import { SpeciesEntity } from '../../domain/species.entity';
import { SpeciesRepositoryPort } from '../ports/species.repository.port';

export interface CreateSpeciesCommand {
  code: string;
  name: string;
  defaultVaccinePlan: boolean;
}

@Injectable()
export class CreateSpeciesUseCase {
  constructor(private readonly speciesRepo: SpeciesRepositoryPort) {}

  async execute(command: CreateSpeciesCommand): Promise<SpeciesEntity> {
    const [codeExists, nameExists] = await Promise.all([
      this.speciesRepo.existsByCode(command.code),
      this.speciesRepo.existsByName(command.name),
    ]);

    if (codeExists) {
      throw new SpeciesCodeAlreadyExistsError(command.code);
    }

    if (nameExists) {
      throw new SpeciesNameAlreadyExistsError(command.name);
    }

    const species = SpeciesEntity.create(randomUUID(), command);
    await this.speciesRepo.save(species);

    return species;
  }
}
