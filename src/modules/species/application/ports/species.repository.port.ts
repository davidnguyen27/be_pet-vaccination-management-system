import { SpeciesEntity } from '../../domain/species.entity';

export interface FindSpeciesOptions {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export abstract class SpeciesRepositoryPort {
  abstract findById(id: string): Promise<SpeciesEntity | null>;
  abstract findByIdOrThrow(id: string): Promise<SpeciesEntity>;
  abstract findMany(options: FindSpeciesOptions): Promise<PaginatedResult<SpeciesEntity>>;
  abstract existsByCode(code: string, excludeId?: string): Promise<boolean>;
  abstract existsByName(name: string, excludeId?: string): Promise<boolean>;
  abstract save(species: SpeciesEntity): Promise<void>;
}
