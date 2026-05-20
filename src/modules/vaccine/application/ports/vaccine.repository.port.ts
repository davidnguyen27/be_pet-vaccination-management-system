import { VaccineEntity } from '../../domain/vaccine.entity';

export interface FindVaccineOptions {
  page: number;
  limit: number;
  search?: string;
  species?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export abstract class VaccineRepositoryPort {
  abstract findById(id: string): Promise<VaccineEntity | null>;
  abstract findByIdOrThrow(id: string): Promise<VaccineEntity>;
  abstract findByCode(code: string): Promise<VaccineEntity | null>;
  abstract findMany(options: FindVaccineOptions): Promise<PaginatedResult<VaccineEntity>>;
  abstract save(vaccine: VaccineEntity): Promise<void>;
}
