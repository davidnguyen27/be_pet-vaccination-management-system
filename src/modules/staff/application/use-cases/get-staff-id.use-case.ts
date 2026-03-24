import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_STAFF_REPOSITORY, IStaffRepository } from '../../domain/i-staff.repository';
import { StaffResponseDto } from '../dtos/staff-res.dto';
import { StaffMapper } from '../../infrastructure/staff.mapper';

@Injectable()
export class GetStaffIdUseCase {
  constructor(@Inject(I_STAFF_REPOSITORY) private readonly staffRepo: IStaffRepository) {}

  async execute(userId: string): Promise<StaffResponseDto> {
    const staff = await this.staffRepo.findByUserId(userId);
    if (!staff) throw new NotFoundException('Staff not found');
    return StaffMapper.toResponse(staff);
  }
}
