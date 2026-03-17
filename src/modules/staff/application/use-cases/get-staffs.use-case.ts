import { Inject, Injectable } from '@nestjs/common';
import { StaffRepository } from '../../infrastructure/staff.repository';
import { StaffQueryDto } from '../dtos/staff-query.dto';
import { StaffResponseDto } from '../dtos/staff-res.dto';
import { PaginationDto } from '@/shared/application/pagination.dto';
import { StaffMapper } from '../../infrastructure/staff.mapper';
import { I_STAFF_REPOSITORY } from '../../domain/i-staff.repository';

@Injectable()
export class GetStaffsUseCase {
  constructor(@Inject(I_STAFF_REPOSITORY) private readonly staffRepo: StaffRepository) {}

  async execute(query: StaffQueryDto): Promise<PaginationDto<StaffResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const result = await this.staffRepo.findAll({
      page,
      limit,
      search: query.search,
    });

    const staffs = result.data.map(staff => StaffMapper.toResponse(staff));

    return new PaginationDto(staffs, { total: result.total, page, limit });
  }
}
