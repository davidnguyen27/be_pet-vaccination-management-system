import { Module } from '@nestjs/common';
import { I_PET_REPOSITORY } from '../domain/i-pet.entity';
import { GetAllPetsUseCase } from '../application/use-cases/get-pets.use-case';
import { PetRepository } from '../infrastructure/pet.repository';
import { PetController } from './pet.controller';
import { GetPetIdUseCase } from '../application/use-cases/get-pet-id.use-case';
import { CreatePetUseCase } from '../application/use-cases/create-pet.use-case';
import { UpdatePetUseCase } from '../application/use-cases/update-pet.use-case';
import { DeletePetUseCase } from '../application/use-cases/delete-pet.use-case';

const useCases = [GetAllPetsUseCase, GetPetIdUseCase, CreatePetUseCase, UpdatePetUseCase, DeletePetUseCase];
@Module({
  controllers: [PetController],
  providers: [...useCases, { provide: I_PET_REPOSITORY, useClass: PetRepository }],
  exports: [I_PET_REPOSITORY],
})
export class PetModule {}
