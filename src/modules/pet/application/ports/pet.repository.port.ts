import { Species } from '@/enums/species';
import { PetEntity } from '../../domain/pet.entity';

export interface FindPetOptions {
  page: number;
  limit: number;
  search?: string;
  species?: Species;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export abstract class PetRepositoryPort {
  abstract findById(id: string): Promise<PetEntity | null>;
  abstract findByIdOrThrow(id: string): Promise<PetEntity>;
  abstract save(pet: PetEntity): Promise<void>;
}
