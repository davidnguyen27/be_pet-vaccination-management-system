import { Module } from '@nestjs/common';
import { VaccinePlanRepositoryPort } from './application/ports/vaccine-plan.repository.port';
import { VaccinePlanQueryPort } from './application/ports/vaccine-plan.query.port';
import { CreateVaccinePlanUseCase } from './application/use-cases/create-vaccine-plan.use-case';
import { DeleteVaccinePlanUseCase } from './application/use-cases/delete-vaccine-plan.use-case';
import { GetVaccinePlansUseCase } from './application/use-cases/get-vaccine-plans.use-case';
import { UpdateVaccinePlanUseCase } from './application/use-cases/update-vaccine-plan.use-case';
import { VaccinePlanQueryPortImp } from './infrastructure/persistence/vaccine-plan.query.imp';
import { VaccinePlanRepository } from './infrastructure/persistence/vaccine-plan.repository.imp';
import { VaccinePlanController } from './presentation/http/vaccine-plan.controller';

const useCases = [GetVaccinePlansUseCase, CreateVaccinePlanUseCase, UpdateVaccinePlanUseCase, DeleteVaccinePlanUseCase];

@Module({
  controllers: [VaccinePlanController],
  providers: [
    ...useCases,
    { provide: VaccinePlanRepositoryPort, useClass: VaccinePlanRepository },
    { provide: VaccinePlanQueryPort, useClass: VaccinePlanQueryPortImp },
  ],
  exports: [VaccinePlanRepositoryPort, VaccinePlanQueryPort],
})
export class VaccinePlanModule {}
