import { Meta } from '@/shared/application/response.dto';
import { Injectable } from '@nestjs/common';
import { VaccinePlanModel } from '../model/vaccine-plan.model';
import { VaccinePlanQueryPort } from '../ports/vaccine-plan.query.port';
import { FindVaccinePlanOptions } from '../ports/vaccine-plan.repository.port';

interface GetVaccinePlansResult {
  items: VaccinePlanModel[];
  meta: Meta;
}

@Injectable()
export class GetVaccinePlansUseCase {
  constructor(private readonly vaccinePlanQuery: VaccinePlanQueryPort) {}

  async getById(id: string): Promise<VaccinePlanModel> {
    return this.vaccinePlanQuery.findById(id);
  }

  async getMany(options: FindVaccinePlanOptions): Promise<GetVaccinePlansResult> {
    const { items, totalItems } = await this.vaccinePlanQuery.findMany(options);
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
