import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_STAFF_REPOSITORY, IStaffRepository } from '../../domain/i-staff.repository';
import { StaffDto } from '../dtos/staff-req.dto';
import { StaffResponseDto } from '../dtos/staff-res.dto';
import { StaffMapper } from '../../infrastructure/staff.mapper';
import { employment_status, employment_type } from '@/enums';

@Injectable()
export class UpdateStaffUseCase {
  constructor(@Inject(I_STAFF_REPOSITORY) private readonly staffRepo: IStaffRepository) {}

  async execute(id: string, dto: StaffDto): Promise<StaffResponseDto> {
    const staff = await this.staffRepo.findById(id);
    if (!staff) throw new NotFoundException('Staff not found');

    const updated = await this.staffRepo.update({
      code: dto.code,
      jobTitle: dto.jobTitle,
      department: dto.department,
      employmentType: dto.employmentType as employment_type,
      employmentStatus: dto.employmentStatus as employment_status,
      joinDate: dto.joinDate,
      endDate: dto.endDate,
      address: dto.address,
      citizenId: dto.citizenId,
      notes: dto.notes,
    });

    return StaffMapper.toResponse(updated);
  }
}
