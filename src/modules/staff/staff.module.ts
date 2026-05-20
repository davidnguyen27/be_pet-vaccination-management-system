import { Module } from '@nestjs/common';
import { StaffRepositoryImpl } from './infrastructure/persistence/staff.repository.imp';
import { GetStaffsUseCase } from './application/use-cases/get-staffs.use-case';
import { UpdateStaffUseCase } from './application/use-cases/update-staff.use-case';
import { StaffRepositoryPort } from './application/ports/staff.repository.port';
import { StaffController } from './presentation/http/staff.controller';
import { StaffQueryPort } from './application/ports/staff.query.port';
import { StaffQueryImp } from './infrastructure/persistence/staff.query.imp';

@Module({
  controllers: [StaffController],
  providers: [
    GetStaffsUseCase,
    UpdateStaffUseCase,
    { provide: StaffRepositoryPort, useClass: StaffRepositoryImpl },
    { provide: StaffQueryPort, useClass: StaffQueryImp },
  ],
  exports: [StaffRepositoryPort, StaffQueryPort],
})
export class StaffModule {}
