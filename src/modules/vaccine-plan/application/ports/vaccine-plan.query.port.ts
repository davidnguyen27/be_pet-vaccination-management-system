import { VaccinePlanModel } from '../model/vaccine-plan.model';
import { FindVaccinePlanOptions, PaginatedResult } from './vaccine-plan.repository.port';

export abstract class VaccinePlanQueryPort {
  abstract findById(id: string): Promise<VaccinePlanModel>;
  abstract findMany(options: FindVaccinePlanOptions): Promise<PaginatedResult<VaccinePlanModel>>;
}
