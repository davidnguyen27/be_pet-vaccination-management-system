import { Injectable } from '@nestjs/common';
import { EmploymentStatus, employment_type } from '@/enums';
import { StaffRepositoryPort } from '../ports/staff.repository.port';
import { StaffEntity } from '../../domain/staff.entity';

interface UpdateStaffCommand {
  id: string;
  code?: string;
  jobTitle?: string | null;
  department?: string | null;
  employmentType?: employment_type;
  employmentStatus?: EmploymentStatus;
  joinDate?: string;
  endDate?: string | null;
  address?: string;
  citizenId?: string;
  notes?: string | null;
}

@Injectable()
export class UpdateStaffUseCase {
  constructor(private readonly staffRepo: StaffRepositoryPort) {}

  async execute(command: UpdateStaffCommand): Promise<StaffEntity> {
    const staff = await this.staffRepo.findByUserIdOrThrow(command.id);

    staff.update({
      code: command.code,
      jobTitle: command.jobTitle,
      department: command.department,
      employmentType: command.employmentType,
      employmentStatus: command.employmentStatus,
      joinDate: command.joinDate !== undefined ? new Date(command.joinDate) : undefined,
      endDate: command.endDate !== undefined ? (command.endDate ? new Date(command.endDate) : null) : undefined,
      address: command.address,
      citizenId: command.citizenId,
      notes: command.notes,
    });

    await this.staffRepo.save(staff);

    return staff;
  }
}
