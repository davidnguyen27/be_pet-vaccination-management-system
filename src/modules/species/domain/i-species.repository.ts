import { PaginatedResult } from '@/modules/user/domain/i-user.repository';
import { SpeciesEntity } from './species.entity';

export interface GetSpeciesFilter {
  page: number;
  limit: number;
  search?: string;
}

export interface I_SpeciesRepository {
  findAll(filter: GetSpeciesFilter): Promise<PaginatedResult<SpeciesEntity>>;
  findById(id: string): Promise<SpeciesEntity | null>;
}

export const I_SPECIES_REPOSITORY = Symbol('ISpeciesRepository');
