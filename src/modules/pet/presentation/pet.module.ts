import { Module } from '@nestjs/common';
import { I_PET_REPOSITORY } from '../domain/i-pet.entity';
import { GetAllPetsUseCase } from '../application/use-cases/get-pets.use-case';
import { PetRepository } from '../infrastructure/pet.repository';
import { PetController } from './pet.controller';

@Module({
  controllers: [PetController],
  providers: [GetAllPetsUseCase, { provide: I_PET_REPOSITORY, useClass: PetRepository }],
  exports: [I_PET_REPOSITORY],
})
export class PetModule {}
