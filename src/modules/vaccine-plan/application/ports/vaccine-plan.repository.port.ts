import { VaccinePlanStatus, VaccineStatus } from '@/enums/vaccine';
import { VaccinePlanEntity } from '../../domain/vaccine-plan.entity';

export interface FindVaccinePlanOptions {
  page: number;
  limit: number;
  search?: string;
  petId?: string;
  vaccineId?: string;
  status?: VaccinePlanStatus;
  dueFrom?: Date;
  dueTo?: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export abstract class VaccinePlanRepositoryPort {
  abstract findById(id: string): Promise<VaccinePlanEntity | null>;
  abstract findByIdOrThrow(id: string): Promise<VaccinePlanEntity>;
  abstract findByVaccinationRecordId(vaccinationRecordId: string): Promise<VaccinePlanEntity | null>;
  abstract findMany(options: FindVaccinePlanOptions): Promise<PaginatedResult<VaccinePlanEntity>>;
  abstract existsPet(petId: string): Promise<boolean>;
  abstract findVaccineStatus(vaccineId: string): Promise<VaccineStatus | null>;
  abstract existsVaccinationRecord(vaccinationRecordId: string): Promise<boolean>;
  abstract save(vaccinePlan: VaccinePlanEntity): Promise<void>;
}
