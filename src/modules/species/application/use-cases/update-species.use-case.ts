import { Injectable } from '@nestjs/common';
import {
  SpeciesCodeAlreadyExistsError,
  SpeciesDeletedError,
  SpeciesNameAlreadyExistsError,
} from '../../domain/exceptions/species.error';
import { SpeciesEntity } from '../../domain/species.entity';
import { SpeciesRepositoryPort } from '../ports/species.repository.port';

interface UpdateSpeciesCommand {
  id: string;
  code: string;
  name: string;
  defaultVaccinePlan: boolean;
}

@Injectable()
export class UpdateSpeciesUseCase {
  constructor(private readonly speciesRepo: SpeciesRepositoryPort) {}

  async execute(command: UpdateSpeciesCommand): Promise<SpeciesEntity> {
    const species = await this.speciesRepo.findByIdOrThrow(command.id);

    if (species.isDeleted) {
      throw new SpeciesDeletedError(command.id);
    }

    const nextCode = command.code.trim().toUpperCase();
    const nextName = command.name.trim();

    const [codeExists, nameExists] = await Promise.all([
      nextCode !== species.code ? this.speciesRepo.existsByCode(nextCode, command.id) : Promise.resolve(false),
      nextName.toLowerCase() !== species.name.toLowerCase()
        ? this.speciesRepo.existsByName(nextName, command.id)
        : Promise.resolve(false),
    ]);

    if (codeExists) {
      throw new SpeciesCodeAlreadyExistsError(nextCode);
    }

    if (nameExists) {
      throw new SpeciesNameAlreadyExistsError(nextName);
    }

    species.update({
      code: nextCode,
      name: nextName,
      defaultVaccinePlan: command.defaultVaccinePlan,
    });

    await this.speciesRepo.save(species);

    return species;
  }
}
