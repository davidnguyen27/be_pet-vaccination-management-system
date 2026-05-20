import { VaccineModel } from '../model/vaccine.model';
import { FindVaccineOptions, PaginatedResult } from './vaccine.repository.port';

export abstract class VaccineQueryPort {
  abstract findById(id: string): Promise<VaccineModel>;
  abstract findMany(options: FindVaccineOptions): Promise<PaginatedResult<VaccineModel>>;
}
