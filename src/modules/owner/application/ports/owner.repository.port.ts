import { OwnerEntity } from '../../domain/owner.entity';

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
}

export interface FindOwnerOptions {
  page: number;
  limit: number;
  search?: string;
}

export abstract class OwnerRepositoryPort {
  abstract findByUserIdOrThrow(userId: string): Promise<OwnerEntity>;
  abstract findMany(options: FindOwnerOptions): Promise<PaginatedResult<OwnerEntity>>;
  abstract save(owner: OwnerEntity): Promise<void>;
}
