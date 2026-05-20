import { Module } from '@nestjs/common';
import { VetRepositoryPort } from './application/ports/vet.repository.port';
import { UpdateVetUseCase } from './application/use-cases/update-vet.use-case';
import { GetVetsUseCase } from './application/use-cases/get-vets.use-case';
import { VetRepositoryImp } from './infrastructure/persistence/vet.repository.imp';
import { VetController } from './presentation/http/vet.controller';
import { VetQueryPort } from './application/ports/vet.query.port';
import { VetQueryImp } from './infrastructure/persistence/vet.query.imp';

const useCases = [GetVetsUseCase, UpdateVetUseCase];

@Module({
  controllers: [VetController],
  providers: [
    ...useCases,
    { provide: VetRepositoryPort, useClass: VetRepositoryImp },
    { provide: VetQueryPort, useClass: VetQueryImp },
  ],
  exports: [VetRepositoryPort, VetQueryPort],
})
export class VetModule {}
