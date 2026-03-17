import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { I_STAFF_REPOSITORY } from '../domain/i-staff.repository';
import { StaffRepository } from '../infrastructure/staff.repository';
import { GetStaffsUseCase } from '../application/use-cases/get-staffs.use-case';
import { GetStaffIdUseCase } from '../application/use-cases/get-staff-id.use-case';
import { UpdateStaffUseCase } from '../application/use-cases/update-staff.use-case';

@Module({
  controllers: [StaffController],
  providers: [
    GetStaffsUseCase,
    GetStaffIdUseCase,
    UpdateStaffUseCase,
    { provide: I_STAFF_REPOSITORY, useClass: StaffRepository },
  ],
  exports: [I_STAFF_REPOSITORY],
})
export class StaffModule {}
