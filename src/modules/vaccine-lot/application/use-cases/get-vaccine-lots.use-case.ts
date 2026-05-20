import { Meta } from '@/shared/application/response.dto';
import { Injectable } from '@nestjs/common';
import { VaccineLotModel } from '../model/vaccine-lot.model';
import { VaccineLotQueryPort } from '../ports/vaccine-lot.query.port';
import { FindVaccineLotOptions } from '../ports/vaccine-lot.repository.port';

interface GetVaccineLotsResult {
  items: VaccineLotModel[];
  meta: Meta;
}

@Injectable()
export class GetVaccineLotsUseCase {
  constructor(private readonly vaccineLotQuery: VaccineLotQueryPort) {}

  async getById(id: string): Promise<VaccineLotModel> {
    return this.vaccineLotQuery.findById(id);
  }

  async getMany(options: FindVaccineLotOptions): Promise<GetVaccineLotsResult> {
    const { items, totalItems } = await this.vaccineLotQuery.findMany(options);
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
