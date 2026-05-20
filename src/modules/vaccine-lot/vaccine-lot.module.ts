import { Module } from '@nestjs/common';
import { VaccineLotController } from './presentation/http/vaccine-lot.controller';
import { VaccineModule } from '../vaccine/vaccine.module';
import { VaccineLotRepositoryPort } from './application/ports/vaccine-lot.repository.port';
import { VaccineLotQueryPort } from './application/ports/vaccine-lot.query.port';
import { CreateVaccineLotUseCase } from './application/use-cases/create-vaccine-lot.use-case';
import { DeleteVaccineLotUseCase } from './application/use-cases/delete-vaccine-lot.use-case';
import { GetVaccineLotsUseCase } from './application/use-cases/get-vaccine-lots.use-case';
import { UpdateVaccineLotUseCase } from './application/use-cases/update-vaccine-lot.use-case';
import { VaccineLotQueryPortImp } from './infrastructure/persistence/vaccine-lot.query.imp';
import { VaccineLotRepository } from './infrastructure/persistence/vaccine-lot.repository.imp';

const useCases = [GetVaccineLotsUseCase, CreateVaccineLotUseCase, UpdateVaccineLotUseCase, DeleteVaccineLotUseCase];

@Module({
  imports: [VaccineModule],
  controllers: [VaccineLotController],
  providers: [
    ...useCases,
    { provide: VaccineLotRepositoryPort, useClass: VaccineLotRepository },
    { provide: VaccineLotQueryPort, useClass: VaccineLotQueryPortImp },
  ],
  exports: [VaccineLotRepositoryPort, VaccineLotQueryPort],
})
export class VaccineLotModule {}
