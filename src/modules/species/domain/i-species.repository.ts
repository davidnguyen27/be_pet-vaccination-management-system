import { Params } from '@/shared/domain/query-params.type';
import { SpeciesEntity } from './species.entity';
import type { PaginatedResult } from '@/shared/domain/paginated-result.type';

export interface I_SpeciesRepository {
  findAll(params: Params): Promise<PaginatedResult<SpeciesEntity>>;
  findById(id: string): Promise<SpeciesEntity | null>;
}

export const I_SPECIES_REPOSITORY = Symbol('ISpeciesRepository');
