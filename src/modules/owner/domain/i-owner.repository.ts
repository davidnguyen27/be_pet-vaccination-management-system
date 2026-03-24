import { Params } from '@/shared/domain/query-params.type';
import { OwnerEntity } from './owner.entity';
import type { PaginatedResult } from '@/shared/domain/paginated-result.type';

export const I_OWNER_REPOSITORY = Symbol('IOwnerRepository');

export interface UpdateOwnerData {
  userId: string;
  address?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
}

export interface IOwnerRepository {
  findAll(params: Params): Promise<PaginatedResult<OwnerEntity>>;
  findById(id: string): Promise<OwnerEntity | null>;
  findByUserId(userId: string): Promise<OwnerEntity | null>;
  update(data: UpdateOwnerData): Promise<OwnerEntity>;
}
