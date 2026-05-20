import { VetEntity } from '../../domain/vet.entity';

export interface FindVetOptions {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export abstract class VetRepositoryPort {
  abstract findByUserIdOrThrow(userId: string): Promise<VetEntity>;
  abstract findMany(options: FindVetOptions): Promise<PaginatedResult<VetEntity>>;
  abstract save(vet: VetEntity): Promise<void>;
}
