import { Module } from '@nestjs/common';
import { SpeciesController } from './presentation/http/species.controller';
import { SpeciesRepositoryPort } from './application/ports/species.repository.port';
import { CreateSpeciesUseCase } from './application/use-cases/create-species.use-case';
import { DeleteSpeciesUseCase } from './application/use-cases/delete-species.use-case';
import { GetSpeciesUseCase } from './application/use-cases/get-species.use-case';
import { UpdateSpeciesUseCase } from './application/use-cases/update-species.use-case';
import { SpeciesRepository } from './infrastructure/persistence/species.repository.imp';

const useCases = [GetSpeciesUseCase, CreateSpeciesUseCase, UpdateSpeciesUseCase, DeleteSpeciesUseCase];

@Module({
  controllers: [SpeciesController],
  providers: [...useCases, { provide: SpeciesRepositoryPort, useClass: SpeciesRepository }],
  exports: [SpeciesRepositoryPort],
})
export class SpeciesModule {}
