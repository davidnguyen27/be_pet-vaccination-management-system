import { VaccineLotModel } from '../model/vaccine-lot.model';
import { FindVaccineLotOptions, PaginatedResult } from './vaccine-lot.repository.port';

export abstract class VaccineLotQueryPort {
  abstract findById(id: string): Promise<VaccineLotModel>;
  abstract findMany(options: FindVaccineLotOptions): Promise<PaginatedResult<VaccineLotModel>>;
}
