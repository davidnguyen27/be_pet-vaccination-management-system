import { Module } from '@nestjs/common';
import { I_VET_REPOSITORY } from '../domain/i-vet.repository';
import { VetRepository } from '../infrastructure/vet.repository';
import { UpdateVetUseCase } from '../application/use-cases/update-staff.use-case';
import { GetVetIdUseCase } from '../application/use-cases/get-vet-id.use-case';
import { GetVetsUseCase } from '../application/use-cases/get-vets.use-case';
import { VetController } from './vet.controller';

@Module({
  controllers: [VetController],
  providers: [
    GetVetsUseCase,
    GetVetIdUseCase,
    UpdateVetUseCase,
    { provide: I_VET_REPOSITORY, useClass: VetRepository },
  ],
  exports: [I_VET_REPOSITORY],
})
export class VetModule {}
