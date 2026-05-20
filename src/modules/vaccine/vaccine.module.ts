import { Module } from '@nestjs/common';
import { VaccineController } from './presentation/http/vaccine.controller';
import { VaccineRepositoryPort } from './application/ports/vaccine.repository.port';
import { VaccineRepository } from './infrastructure/persistence/vaccine.repository.imp';
import { GetVaccinesUseCase } from './application/use-cases/get-vaccines.use-case';
import { CreateVaccineUseCase } from './application/use-cases/create-vaccine.use-case';
import { UpdateVaccineUseCase } from './application/use-cases/update-vaccine.use-case';
import { DeleteVaccineUseCase } from './application/use-cases/delete-vaccine.use-case';
import { VaccineQueryPort } from './application/ports/vaccine.query.port';
import { VaccineQueryPortImp } from './infrastructure/persistence/vaccine.query.imp';

const useCases = [GetVaccinesUseCase, CreateVaccineUseCase, UpdateVaccineUseCase, DeleteVaccineUseCase];
@Module({
  controllers: [VaccineController],
  providers: [
    ...useCases,
    { provide: VaccineRepositoryPort, useClass: VaccineRepository },
    { provide: VaccineQueryPort, useClass: VaccineQueryPortImp },
  ],
  exports: [VaccineRepositoryPort, VaccineQueryPort],
})
export class VaccineModule {}
