import { Module } from '@nestjs/common';
import { WorkingShiftQueryPort } from './application/ports/working-shift.query.port';
import { WorkingShiftRepositoryPort } from './application/ports/working-shift.repository.port';
import { CreateWorkingShiftUseCase } from './application/use-cases/create-working-shift.use-case';
import { DeleteWorkingShiftUseCase } from './application/use-cases/delete-working-shift.use-case';
import { GetWorkingShiftsUseCase } from './application/use-cases/get-working-shifts.use-case';
import { UpdateWorkingShiftUseCase } from './application/use-cases/update-working-shift.use-case';
import { WorkingShiftQueryPortImp } from './infrastructure/persistence/working-shift.query.imp';
import { WorkingShiftRepository } from './infrastructure/persistence/working-shift.repository.imp';
import { WorkingShiftController } from './presentation/http/working-shift.controller';

const useCases = [
  GetWorkingShiftsUseCase,
  CreateWorkingShiftUseCase,
  UpdateWorkingShiftUseCase,
  DeleteWorkingShiftUseCase,
];

@Module({
  controllers: [WorkingShiftController],
  providers: [
    ...useCases,
    { provide: WorkingShiftRepositoryPort, useClass: WorkingShiftRepository },
    { provide: WorkingShiftQueryPort, useClass: WorkingShiftQueryPortImp },
  ],
  exports: [WorkingShiftRepositoryPort, WorkingShiftQueryPort],
})
export class WorkingShiftModule {}
