import { Module } from '@nestjs/common';
import { SpeciesController } from './species.controller';
import { GetSpeciesUseCase } from '../application/use-cases/get-species.use-case';
import { SpeciesRepository } from '../infrastructure/species.repository';
import { I_SPECIES_REPOSITORY } from '../domain/i-species.repository';
import { GetSpeciesIdUseCase } from '../application/use-cases/get-species-id.use-case';

const useCases = [GetSpeciesUseCase, GetSpeciesIdUseCase];
@Module({
  controllers: [SpeciesController],
  providers: [...useCases, { provide: I_SPECIES_REPOSITORY, useClass: SpeciesRepository }],
})
export class SpeciesModule {}
