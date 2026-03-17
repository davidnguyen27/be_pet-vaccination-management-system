import { PetEntity } from './pet.entity';

export const I_PET_REPOSITORY = Symbol('IPetRepository');

export interface GetPetsFilter {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IPetRepository {
  findAll(): Promise<PetEntity[]>;
  findAllWithFilters(filter: GetPetsFilter): Promise<PaginatedResult<PetEntity>>;
  // findById(id: string): Promise<PetEntity | null>;
}
