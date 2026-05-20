import { Module } from '@nestjs/common';
import { PetRepositoryPort } from './application/ports/pet.repository.port';
import { GetPetsUseCase } from './application/use-cases/get-pets.use-case';
import { PetRepositoryImp } from './infrastructure/persistence/pet.repository.imp';
import { PetController } from './presentation/http/pet.controller';
import { CreatePetUseCase } from './application/use-cases/create-pet.use-case';
import { UpdatePetUseCase } from './application/use-cases/update-pet.use-case';
import { DeletePetUseCase } from './application/use-cases/delete-pet.use-case';
import { PetQueryPort } from './application/ports/pet.query.port';
import { PetQueryImp } from './infrastructure/persistence/pet.query.imp';

const useCases = [GetPetsUseCase, CreatePetUseCase, UpdatePetUseCase, DeletePetUseCase];
@Module({
  controllers: [PetController],
  providers: [
    ...useCases,
    { provide: PetRepositoryPort, useClass: PetRepositoryImp },
    { provide: PetQueryPort, useClass: PetQueryImp },
  ],
  exports: [PetRepositoryPort, PetQueryPort],
})
export class PetModule {}
