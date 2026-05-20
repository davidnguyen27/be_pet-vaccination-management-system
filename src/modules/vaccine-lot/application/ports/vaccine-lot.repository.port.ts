import { VaccineLotStatus } from '@/enums/vaccine';
import { VaccineLotEntity } from '../../domain/vaccine-lot.entity';

export interface FindVaccineLotOptions {
  page: number;
  limit: number;
  search?: string;
  vaccineId?: string;
  status?: VaccineLotStatus;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export abstract class VaccineLotRepositoryPort {
  abstract findById(id: string): Promise<VaccineLotEntity | null>;
  abstract findByIdOrThrow(id: string): Promise<VaccineLotEntity>;
  abstract findByLotNo(lotNo: string): Promise<VaccineLotEntity | null>;
  abstract findMany(options: FindVaccineLotOptions): Promise<PaginatedResult<VaccineLotEntity>>;
  abstract save(vaccineLot: VaccineLotEntity): Promise<void>;
}
