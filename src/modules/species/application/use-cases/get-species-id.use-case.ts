import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_SPECIES_REPOSITORY, I_SpeciesRepository } from '../../domain/i-species.repository';
import { SpeciesMapper } from '../../infrastructure/species.mapper';

@Injectable()
export class GetSpeciesIdUseCase {
  constructor(@Inject(I_SPECIES_REPOSITORY) private readonly speciesRepo: I_SpeciesRepository) {}

  async execute(id: string) {
    const species = await this.speciesRepo.findById(id);
    if (!species) throw new NotFoundException('Species not found');
    return SpeciesMapper.toResponse(species);
  }
}
