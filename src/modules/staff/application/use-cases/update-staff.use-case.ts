import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_STAFF_REPOSITORY, IStaffRepository } from '../../domain/i-staff.repository';
import { StaffDto } from '../dtos/staff-req.dto';
import { StaffResponseDto } from '../dtos/staff-res.dto';
import { StaffMapper } from '../../infrastructure/staff.mapper';

@Injectable()
export class UpdateStaffUseCase {
  constructor(@Inject(I_STAFF_REPOSITORY) private readonly staffRepo: IStaffRepository) {}

  async execute(userId: string, dto: StaffDto): Promise<StaffResponseDto> {
    const staff = await this.staffRepo.findByUserId(userId);
    if (!staff) throw new NotFoundException('Staff not found');

    const updated = await this.staffRepo.update({
      userId,
      ...(dto.code !== undefined && { code: dto.code }),
      ...(dto.jobTitle !== undefined && { jobTitle: dto.jobTitle }),
      ...(dto.department !== undefined && { department: dto.department }),
      ...(dto.employmentType !== undefined && { employmentType: dto.employmentType }),
      ...(dto.employmentStatus !== undefined && { employmentStatus: dto.employmentStatus }),
      ...(dto.joinDate !== undefined && { joinDate: dto.joinDate }),
      ...(dto.endDate !== undefined && { endDate: dto.endDate }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.citizenId !== undefined && { citizenId: dto.citizenId }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    });

    return StaffMapper.toResponse(updated);
  }
}
