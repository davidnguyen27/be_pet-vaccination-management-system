import { Injectable } from '@nestjs/common';
import { Meta } from '@/shared/application/response.dto';
import { FindStaffOptions } from '../ports/staff.repository.port';
import { StaffModel } from '../model/staff.model';
import { StaffQueryPort } from '../ports/staff.query.port';

interface GetStaffsResult {
  items: StaffModel[];
  meta: Meta;
}

@Injectable()
export class GetStaffsUseCase {
  constructor(private readonly staffQuery: StaffQueryPort) {}

  async getById(id: string): Promise<StaffModel> {
    const staff = await this.staffQuery.findByUserId(id);
    return staff;
  }

  async getMany(options: FindStaffOptions): Promise<GetStaffsResult> {
    const { items, totalItems } = await this.staffQuery.findMany(options);
    const totalPages = options.limit > 0 ? Math.ceil(totalItems / options.limit) : 0;

    return {
      items,
      meta: {
        page: options.page,
        limit: options.limit,
        total: totalItems,
        totalPages,
      },
    };
  }
}
