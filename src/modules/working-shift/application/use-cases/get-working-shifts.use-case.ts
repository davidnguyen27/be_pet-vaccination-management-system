import { Meta } from '@/shared/application/response.dto';
import { Injectable } from '@nestjs/common';
import { WorkingShiftModel } from '../model/working-shift.model';
import { WorkingShiftQueryPort } from '../ports/working-shift.query.port';
import { FindWorkingShiftOptions } from '../ports/working-shift.repository.port';

interface GetWorkingShiftsResult {
  items: WorkingShiftModel[];
  meta: Meta;
}

@Injectable()
export class GetWorkingShiftsUseCase {
  constructor(private readonly workingShiftQuery: WorkingShiftQueryPort) {}

  async getById(id: string): Promise<WorkingShiftModel> {
    return this.workingShiftQuery.findById(id);
  }

  async getMany(options: FindWorkingShiftOptions): Promise<GetWorkingShiftsResult> {
    const { items, totalItems } = await this.workingShiftQuery.findMany(options);
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
