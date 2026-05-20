import { Injectable } from '@nestjs/common';
import { Meta } from '@/shared/application/response.dto';
import { VaccineModel } from '../model/vaccine.model';
import { VaccineQueryPort } from '../ports/vaccine.query.port';
import { FindVaccineOptions } from '../ports/vaccine.repository.port';

interface GetVaccinesResult {
  items: VaccineModel[];
  meta: Meta;
}

@Injectable()
export class GetVaccinesUseCase {
  constructor(private readonly vaccineQuery: VaccineQueryPort) {}

  async getById(id: string): Promise<VaccineModel> {
    return this.vaccineQuery.findById(id);
  }

  async getMany(options: FindVaccineOptions): Promise<GetVaccinesResult> {
    const { items, totalItems } = await this.vaccineQuery.findMany(options);
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
